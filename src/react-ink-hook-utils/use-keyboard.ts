/*
 * Copyright 2021 R3BL LLC. All rights reserved.
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
import { useState } from "react"
import { _callIfTrue } from "../misc-utils"
import { UserInputKeyPress } from "../node-keyb-utils"
import { StateHook } from "../react-hook-utils"

// TODO rename this to useKeyboardCompat & add comments

//#region Types.

export type KeyboardInputHandlerFn = (input: UserInputKeyPress) => void
export type UseKeyboardReturnType = {
  keyPress: UserInputKeyPress | undefined
  inRawMode: boolean
}
export type ActionFn = () => void
export type Shortcuts = string[] // "Shortcuts" aka "KeyBindings".
export type KeyBindingsForActions = Map<Shortcuts, ActionFn>

//#endregion

//#region Custom hooks.

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboard = (fun: KeyboardInputHandlerFn): UseKeyboardReturnType => {
  const [ keyPress, setKeyPress ]: StateHook<UserInputKeyPress | undefined> = useState()
  const { isRawModeSupported: inRawMode } = useStdin()
  
  // Can only call useInput in raw mode.
  if (!inRawMode) return { keyPress: undefined, inRawMode: false }
  
  useInput((input, key) => {
    const userInputKeyPress = UserInputKeyPress.createFromInk(key, input)
    setKeyPress(userInputKeyPress)
    fun(userInputKeyPress)
  })
  
  return { keyPress, inRawMode }
}

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboardWithMap = (map: KeyBindingsForActions): UseKeyboardReturnType =>
  useKeyboard((keyPress) => processKeyPress(keyPress, map))

//#endregion

//#region Handle user input key presses.

export const processKeyPress = (userInput: UserInputKeyPress, map: KeyBindingsForActions): void => {
  const _tryToMatchUserInputToEntry = (actionFn: ActionFn, shortcuts: Shortcuts) =>
    shortcuts.forEach((shortcut) => _callIfTrue(userInput.matches(shortcut), actionFn))
  map.forEach(_tryToMatchUserInputToEntry)
}

//#endregion
