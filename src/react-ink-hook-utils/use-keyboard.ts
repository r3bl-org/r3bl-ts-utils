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
    const userInputKeyPress = new UserInputKeyPress(key, input)
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

export const createNewKeyPressesToActionMap = (): KeyBindingsForActions => new Map()

// https://www.nadershamma.dev/blog/2019/how-to-access-object-properties-dynamically-using-bracket-notation-in-typescript/
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types
const specialKeysPropertyNames: Array<keyof Key> = [
  "upArrow", "downArrow", "leftArrow", "rightArrow", "pageDown", "pageUp", "return",
  "escape", "tab", "backspace", "delete"
]

export class UserInputKeyPress {
  constructor(readonly _key: Key | undefined, readonly _input: string | undefined) {}
  
  get input(): string {
    return this._input ? this._input.toLowerCase() : "" /* falsy */
  }
  
  get key(): string {
    return this._key ? this.convertKeyToString() : "" /* falsy */
  }
  
  toString = (): string => {
    const { isSpecialKey, key: key_getter, input: input_getter } = this
    
    if (isSpecialKey()) return `${key_getter}`
    
    if (key_getter && input_getter) return `${key_getter}+${input_getter}`
    if (key_getter && !input_getter) return key_getter
    if (!key_getter && input_getter) return input_getter
    
    return ""
  }
  
  /** Key is special if it can be pressed independently of input, eg: "upArrow" and "downArrow". */
  isSpecialKey = (): boolean => {
    const { _key } = this
    
    if (!_key) return false
    
    for (const propertyName of specialKeysPropertyNames)
      if (_key[propertyName]) return true
    
    return false
  }
  
  matches = (selector: string): boolean => this.toString() === selector
  
  /**
   * If _key is defined, then return it as a string (in lowercase), eg: "backspace", "downarrow".
   */
  private convertKeyToString = (): string => {
    const { _key } = this
    
    if (!_key) return ""
    
    // https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
    type PropertyFlags<T> = {
      [Property in keyof T as string]: boolean
    }
    
    const properties: PropertyFlags<Key> = {
      backspace: _key.backspace,
      ctrl: _key.ctrl,
      delete: _key.delete,
      downArrow: _key.downArrow,
      escape: _key.escape,
      leftArrow: _key.leftArrow,
      meta: _key.meta,
      pageDown: _key.pageDown,
      pageUp: _key.pageUp,
      return: _key.return,
      rightArrow: _key.rightArrow,
      shift: _key.shift,
      tab: _key.tab,
      upArrow: _key.upArrow,
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
