/*
 * Copyright (c) 2022 R3BL LLC. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import EventEmitter from "events"
import { useInput, useStdin } from "ink"
import StdinContext from "ink/build/components/StdinContext"
import { noop } from "lodash"
import React, { DependencyList, EffectCallback, FC, useEffect, useMemo, useState } from "react"
import { _let } from "../kotlin-lang-utils"
import { _callIfTruthy } from "../misc-utils"
import { StateHook } from "../react-hook-utils"
import {
  createFromInk, createFromKeypress, isTTY, Keypress, NodeKeypressFn, ReadlineKey, useNodeKeypress,
} from "./index"

/**
 Ink has a hook that is supposed to be used to get user input from the keyboard called `useInput`,
 which comes from the `ink` package. `TextInput` is built on top of this hook. `TextInput` comes from
 the npm package `ink-text-input`.
 
 1. [useInput sets raw mode to false](https://github.com/vadimdemedes/ink/blob/master/src/hooks/use-input.ts#L126)
 2. [TextInput uses useInput](https://github.com/vadimdemedes/ink-text-input/blob/master/source/index.tsx#L117)
 
 The `useKeyboard` hook makes some assumptions.
 
 1. It will set raw mode to true when used.
 2. It will turn raw mode to false when unmounted.
 
 The problem w/ `TextInput` using `useInput` and then turning raw mode to off when focus changes on
 `TextInput` simply causes the Node.js process to exit, since there are no active listeners attached
 to it 🤯.
 
 To mitigate this problem is really simple - just make sure to call `useInput(noop)` somewhere in the
 component that includes `TextInput`!
 
 ⚠ However, this does not get rid of the default "ctrl+c" handling, which is to exit the app (this
 is how useInput behaves by default). You can override it by wrapping your Ink components in a
 Provider, like so:
 ```
 <StdinContext.Provider
 value={{
        stdin: process.stdin,
        setRawMode: noop,
        isRawModeSupported: true,
        internal_exitOnCtrlC: false
      }}
 >
 <App/>
 </StdinContext.Provider>
 ```
 or simply:
 ```
 <UseKeyboardWrapper>
 <App/>
 </UseKeyboardWrapper>
 ```
 */
export const UseKeyboardWrapper: FC<{ children?: React.ReactNode }> = ({ children }) => {
  // https://www.carlrippon.com/react-children-with-typescript/
  return (
    <StdinContext.Provider
      value={{
        stdin: process.stdin,
        setRawMode: noop,
        isRawModeSupported: true,
        internal_exitOnCtrlC: false
      }}
    >
      {children}
    </StdinContext.Provider>
  )
}

/** @deprecated Please use UseKeyboardWrapper instead. */
export const usePreventUseInputFromSettingRawModeToFalseAndExiting = () => useInput(noop)

// Types.

export type KeyboardInputHandlerFn = (input: Readonly<Keypress>) => void
export const createNewShortcutToActionMap = (): ShortcutToActionMap => new Map()

export class UseKeyboardReturnValue {
  constructor(readonly keyPress: Readonly<Keypress> | undefined, readonly inRawMode: boolean) {}
  
  toArray() {
    return [ this.keyPress, this.inRawMode ]
  }
}

export type ActionFn = () => void
export type Shortcut = string // "Shortcut" aka "KeyBinding".
export type ShortcutToActionMap = Map<Shortcut, ActionFn>

type NodeKeypressTesting = {
  /** Replaces Node.js process.stdin keypress source. */
  emitter: EventEmitter,
  /** Choice of event name representing keypress, to fire and listen for. */
  eventName: string,
}

type Args =
  { type: "fun", matchKeypressFn: KeyboardInputHandlerFn } |
  { type: "map", map: ShortcutToActionMap } |
  { type: "map-cached", createShortcutsFn: () => ShortcutToActionMap, deps?: DependencyList }

interface UseKeyboardOptionsInkCompat {
  type: "ink-compat"
  args: Args
}

interface UseKeyboardOptionsNodeKeypress {
  type: "node-keypress"
  args: Args
  testing?: NodeKeypressTesting
}

export type UseKeyboardOptions = UseKeyboardOptionsInkCompat | UseKeyboardOptionsNodeKeypress

// Hooks.

export const useKeyboardBuilder = (options: UseKeyboardOptions): UseKeyboardReturnValue => {
  switch (options.type) {
    case "ink-compat": {
      switch (options.args.type) {
        case "fun":
          return useKeyboardCompatInk(options.args.matchKeypressFn)
        case "map-cached":
          return useKeyboardCompatInkWithMapCached(
            options.args.createShortcutsFn,
            options.args.deps
          )
        case "map":
          return useKeyboardCompatInkWithMap(options.args.map)
      }
      break
    }
    case "node-keypress": {
      switch (options.args.type) {
        case "fun":
          return useKeyboard(options.args.matchKeypressFn, options.testing)
        case "map-cached":
          return useKeyboardWithMapCached(
            options.args.createShortcutsFn,
            options.args.deps,
            options.testing
          )
        case "map":
          return useKeyboardWithMap(options.args.map, options.testing)
      }
      break
    }
  }
}

export const processKeyPress = (userInput: Readonly<Keypress>, map: ShortcutToActionMap): void => {
  _callIfTruthy(map.get(userInput.toString()), actionFn => actionFn())
}

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboard = (
  processFn: KeyboardInputHandlerFn,
  testing?: NodeKeypressTesting
): UseKeyboardReturnValue => {
  const [ keyPress, setKeyPress ]: StateHook<Readonly<Keypress> | undefined> = useState()
  
  const onKeypress: NodeKeypressFn = (input: string, key: ReadlineKey) =>
    _let(createFromKeypress(key, input), (keyPress) => {
      setKeyPress(keyPress)
      processFn(keyPress)
    })
  
  if (testing) {
    // Testing bypass process.stdin as the event emitter for "keypress" events (via readline).
    const attachListenerToEmitter: EffectCallback = () => {
      const { emitter, eventName } = testing
      emitter.on(eventName, onKeypress)
    }
    useEffect(attachListenerToEmitter, []) // Attach only once.
  } else {
    // Production code.
    if (!isTTY()) return new UseKeyboardReturnValue(undefined, false)
    useNodeKeypress(onKeypress)
  }
  
  return new UseKeyboardReturnValue(keyPress, true)
}

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardWithMap = (
  map: ShortcutToActionMap,
  testing?: NodeKeypressTesting
): UseKeyboardReturnValue =>
  useKeyboard((keyPress) => processKeyPress(keyPress, map), testing)

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardWithMapCached = (
  createMapFn: () => ShortcutToActionMap,
  depsList?: DependencyList,
  testing?: NodeKeypressTesting
): UseKeyboardReturnValue => {
  const cachedMap: ShortcutToActionMap = useMemo(() => createMapFn(), depsList ? depsList : [])
  return useKeyboardWithMap(cachedMap, testing)
}


/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardCompatInk = (fun: KeyboardInputHandlerFn): UseKeyboardReturnValue => {
  const [ keyPress, setKeyPress ]: StateHook<Readonly<Keypress> | undefined> = useState()
  const { isRawModeSupported: inRawMode } = useStdin()
  
  // Can only call useInput in raw mode.
  if (!inRawMode) return new UseKeyboardReturnValue(undefined, false)
  
  useInput((input, key) => {
    const userInputKeyPress = createFromInk(key, input)
    setKeyPress(userInputKeyPress)
    fun(userInputKeyPress)
  })
  
  return new UseKeyboardReturnValue(keyPress, inRawMode)
}

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardCompatInkWithMap = (map: ShortcutToActionMap): UseKeyboardReturnValue =>
  useKeyboardCompatInk((keyPress) => processKeyPress(keyPress, map))

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardCompatInkWithMapCached = (
  createMapFn: () => ShortcutToActionMap,
  depsList?: DependencyList
): UseKeyboardReturnValue => {
  const cachedMap: ShortcutToActionMap = useMemo(() => createMapFn(), depsList ? depsList : [])
  return useKeyboardCompatInkWithMap(cachedMap)
}

