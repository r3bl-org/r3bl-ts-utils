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

import { useInput, useStdin } from "ink"
import { DependencyList, useMemo, useState } from "react"
import { _let } from "../kotlin-lang-utils"
import { _callIfTruthy, noop } from "../misc-utils"
import { StateHook } from "../react-hook-utils"
import {
  createFromInk, createFromKeypress, isTTY, Keypress, NodeKeypressFn, ReadlineKey, useNodeKeypress,
} from "./index"

//#region Types.

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

//#endregion

//#region Custom hooks - useKeyboard that is Ink compatible.

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

//#endregion

//#region Custom hooks - useKeyboard that uses readline keypress events.

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboard = (processFn: KeyboardInputHandlerFn): UseKeyboardReturnValue => {
  const [ keyPress, setKeyPress ]: StateHook<Readonly<Keypress> | undefined> = useState()
  
  if (!isTTY()) return new UseKeyboardReturnValue(undefined, false)
  
  const onKeypress: NodeKeypressFn = (input: string, key: ReadlineKey) =>
    _let(createFromKeypress(key, input), (keyPress) => {
      setKeyPress(keyPress)
      processFn(keyPress)
    })
  useNodeKeypress(onKeypress)
  return new UseKeyboardReturnValue(keyPress, true)
}

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardWithMap = (map: ShortcutToActionMap): UseKeyboardReturnValue =>
  useKeyboard((keyPress) => processKeyPress(keyPress, map))

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardWithMapCached = (
  createMapFn: () => ShortcutToActionMap,
  depsList?: DependencyList
): UseKeyboardReturnValue => {
  const cachedMap: ShortcutToActionMap = useMemo(() => createMapFn(), depsList ? depsList : [])
  return useKeyboardWithMap(cachedMap)
}

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

//#endregion

//#region Handle user input key presses.

export const processKeyPress = (userInput: Readonly<Keypress>, map: ShortcutToActionMap): void => {
  _callIfTruthy(map.get(userInput.toString()), (actionFn) => actionFn())
}

//#endregion


/**
 Ink has a hook that is supposed to be used to get user input from the keyboard called `useInput`,
 which comes from the `ink` package. `TextInput` is built on top of this hook. `TextInput` comes from
 the npm package `ink-text-input`.
 
 1. [useInput sets raw mode to false](https://github.com/vadimdemedes/ink/blob/master/src/hooks/use-input.ts#L126)
 2. [TextInput uses useInput](https://github.com/vadimdemedes/ink-text-input/blob/master/source/index.tsx#L117)
 
 I created a new hook `useKeyboard` which makes some assumptions.
 
 1. It will set raw mode to true when used.
 2. It will turn raw mode to false when unmounted.
 
 The problem w/ `TextInput` using `useInput` and then turning raw mode to off when focus changes on
 `TextInput` simply causes the Node.js process to exit, since there are no active listeners attached
 to it 🤯.
 
 To mitigate this problem is really simple - just make sure to call `useInput(noop)` somewhere in the
 component that includes `TextInput`!
 */
export const usePreventUseInputFromSettingRawModeToFalseAndExiting = () => useInput(noop)