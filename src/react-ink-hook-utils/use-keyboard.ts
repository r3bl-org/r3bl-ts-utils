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

import { Key, useInput, useStdin } from "ink"
import { useState } from "react"
import { _callIfTrue } from "../misc-utils"
import { StateHook } from "../react-hook-utils"

//#region Types.

export type KeyboardInputHandlerFn = (input: UserInputKeyPress) => void
export type UseKeyboardReturnType = [UserInputKeyPress | undefined, boolean]
export type ActionFn = () => void
export type Shortcuts = string[]
export type KeyBindingsForActions = Map<Shortcuts, ActionFn>

//#endregion

//#region Custom hooks.

/**
 * @return [keyPress, inRawMode] - inRawMode is false means keyboard input is disabled in
 * terminal. keyPress is the key that the user pressed (eg: "ctrl+k", "backspace", "shift+A").
 */
export const useKeyboard = (fun: KeyboardInputHandlerFn): UseKeyboardReturnType => {
  const [keyPress, setKeyPress]: StateHook<UserInputKeyPress | undefined> = useState()
  const { isRawModeSupported: inRawMode } = useStdin()

  if (!inRawMode) return [undefined, false] // Can only call useInput in raw mode.

  useInput((input, key) => {
    const userInputKeyPress = new UserInputKeyPress(input, key)
    setKeyPress(userInputKeyPress)
    fun(userInputKeyPress)
  })

  return [keyPress, inRawMode]
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

export const createNewKeyPressesToActionMap = (): KeyBindingsForActions => new Map()

export class UserInputKeyPress {
  constructor(readonly _input: string | undefined, readonly _key: Key | undefined) {}

  get input(): string {
    return this._input ? this._input : ""
  }

  get key(): string | undefined {
    return this._key ? this.convertKeyToString() : ""
  }

  toString = () => {
    const { key, input } = this
    if (key && input) return `${key}+${input}`
    if (key && !input) return key
    if (!key && input) return input
    return ""
  }

  matches = (selector: string): boolean => this.toString() === selector

  /**
   * If _key is defined, then return it as a string (in lowercase), eg: "backspace", "downarrow".
   */
  private convertKeyToString = (): string => {
    const { _key: key } = this

    if (!key) return ""

    // https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
    type PropertyFlags<T> = {
      [Property in keyof T as string]: boolean
    }

    const properties: PropertyFlags<Key> = {
      backspace: key.backspace,
      ctrl: key.ctrl,
      delete: key.delete,
      downArrow: key.downArrow,
      escape: key.escape,
      leftArrow: key.leftArrow,
      meta: key.meta,
      pageDown: key.pageDown,
      pageUp: key.pageUp,
      return: key.return,
      rightArrow: key.rightArrow,
      shift: key.shift,
      tab: key.tab,
      upArrow: key.upArrow,
    }
    for (const key in properties) {
      if (properties[key]) return key.toLowerCase()
    }

    return ""
  }

  // https://developerlife.com/2021/07/02/nodejs-typescript-handbook/#user-defined-type-guards
  static isKeyType = (param: any): param is Key => {
    const key = param as Key
    return (
      key.upArrow !== undefined &&
      key.downArrow !== undefined &&
      key.leftArrow !== undefined &&
      key.rightArrow !== undefined &&
      key.pageDown !== undefined &&
      key.pageUp !== undefined &&
      key.return !== undefined &&
      key.escape !== undefined &&
      key.ctrl !== undefined &&
      key.shift !== undefined &&
      key.tab !== undefined &&
      key.backspace !== undefined &&
      key.delete !== undefined &&
      key.meta !== undefined
    )
  }
}

//#endregion
