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
import React, { FC, useMemo, useState } from "react"
import { _let } from "../lang-utils/kotlin-lang-utils"
import { Optional, Pair, } from "../lang-utils/core"
import { _callIfTruthyWithReturn } from "../lang-utils/expression-lang-utils"
import { IsActive, StateHook, useEventEmitter } from "../tui-core"
import { Keypress } from "./keypress"
import { createFromInk } from "./keypress-builder-ink"
import { createFromKeypress } from "./keypress-builder-readline"
import { ReadlineKey } from "./readline-config"
import { tryToRunActionForShortcut } from "./use-keyboard-internal"
import { HandleNodeKeypressFn, useNodeKeypress } from "./use-node-keypress"
import { isTTY } from "./utils"

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
  constructor(readonly keyPress: Readonly<Keypress> | undefined, readonly inRawMode: boolean) { }

  toArray(): Pair<Optional<Readonly<Keypress>>, boolean> {
    return [ this.keyPress, this.inRawMode ]
  }
}

export type ActionFn = () => void
export type Shortcut = string // "Shortcut" aka "KeyBinding".
export type ShortcutToActionMap = Map<Shortcut, ActionFn>

export type NodeKeypressTesting = {
  /** Replaces Node.js process.stdin keypress source. */
  emitter: EventEmitter,
  /** Choice of event name representing keypress, to fire and listen for. */
  eventName: string,
}

type Common =
  { type: "fun", matchKeypressFn: KeyboardInputHandlerFn, options: IsActive } |
  { type: "map", map: ShortcutToActionMap, options: IsActive } |
  { type: "map-cached", createShortcutsFn: () => ShortcutToActionMap, options: IsActive }

interface UseKeyboardConfigInkCompat {
  type: "ink-compat"
  args: Common
}

interface UseKeyboardConfigNodeKeypress {
  type: "node-keypress"
  args: Common
  testing?: NodeKeypressTesting
}

export type UseKeyboardConfig = UseKeyboardConfigInkCompat | UseKeyboardConfigNodeKeypress

// Hooks.

export const useKeyboardBuilder = (config: UseKeyboardConfig): UseKeyboardReturnValue => {
  switch (config.type) {
    case "node-keypress": {
      switch (config.args.type) {
        case "fun":
          return useKeyboard(
            config.args.matchKeypressFn,
            config.args.options,
            config.testing
          )
        case "map-cached":
          return useKeyboardWithMapCached(
            config.args.createShortcutsFn,
            config.args.options,
            config.testing
          )
        case "map":
          return useKeyboardWithMap(
            config.args.map,
            config.args.options,
            config.testing
          )
      }
    }
    case "ink-compat": {
      switch (config.args.type) {
        case "fun":
          return useKeyboardCompatInk(
            config.args.matchKeypressFn,
            config.args.options,
          )
        case "map-cached":
          return useKeyboardCompatInkWithMapCached(
            config.args.createShortcutsFn,
            config.args.options
          )
        case "map":
          return useKeyboardCompatInkWithMap(
            config.args.map,
            config.args.options,
          )
      }
    }
  }
}

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboard = (
  processKeypressFn: KeyboardInputHandlerFn,
  options: IsActive = { isActive: true },
  testing?: NodeKeypressTesting
): UseKeyboardReturnValue => {
  const [ keyPress, setKeyPress ]: StateHook<Readonly<Keypress> | undefined> = useState()

  const onKeypress: HandleNodeKeypressFn = (input: string, key: ReadlineKey) =>
    _let(createFromKeypress(key, input), keyPress => {
      setKeyPress(keyPress)
      processKeypressFn(keyPress)
    })

  // Testing bypass process.stdin as the event emitter for "keypress" events (via readline).
  // @see multi-select-input.tsx
  return _callIfTruthyWithReturn(
    testing,
    // Testing mode.
    ({ emitter, eventName }) => {
      useEventEmitter(emitter, eventName, onKeypress, options)
      return new UseKeyboardReturnValue(keyPress, true)
    },
    // Production mode.
    () => {
      if (!isTTY()) return new UseKeyboardReturnValue(undefined, false)
      useNodeKeypress(onKeypress, options)
      return new UseKeyboardReturnValue(keyPress, true)
    }
  )
}

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardWithMap = (
  map: ShortcutToActionMap,
  options: IsActive = { isActive: true },
  testing?: NodeKeypressTesting
): UseKeyboardReturnValue =>
  useKeyboard(
    keyPress => tryToRunActionForShortcut(keyPress, map),
    options,
    testing
  )

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardWithMapCached = (
  createMapFn: () => ShortcutToActionMap,
  options: IsActive = { isActive: true },
  testing?: NodeKeypressTesting
): UseKeyboardReturnValue => {
  const cachedMap: ShortcutToActionMap = useMemo(() => createMapFn(), [ options.isActive ])
  return useKeyboardWithMap(cachedMap, options, testing)
}


/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardCompatInk = (
  fun: KeyboardInputHandlerFn,
  options: IsActive = { isActive: true },
): UseKeyboardReturnValue => {
  const [ keyPress, setKeyPress ]: StateHook<Readonly<Keypress> | undefined> = useState()
  const { isRawModeSupported: inRawMode } = useStdin()

  // Can only call useInput in raw mode.
  if (!inRawMode) return new UseKeyboardReturnValue(undefined, false)

  useInput((input, key) => {
    const userInputKeyPress = createFromInk(key, input)
    setKeyPress(userInputKeyPress)
    fun(userInputKeyPress)
  }, options)

  return new UseKeyboardReturnValue(keyPress, inRawMode)
}

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardCompatInkWithMap = (
  map: ShortcutToActionMap,
  options: IsActive = { isActive: true },
): UseKeyboardReturnValue =>
  useKeyboardCompatInk(keyPress => tryToRunActionForShortcut(keyPress, map), options)

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardCompatInkWithMapCached = (
  createMapFn: () => ShortcutToActionMap,
  options: IsActive = { isActive: true },
): UseKeyboardReturnValue => {
  const cachedMap: ShortcutToActionMap = useMemo(() => createMapFn(), [ options.isActive ])
  return useKeyboardCompatInkWithMap(cachedMap)
}

