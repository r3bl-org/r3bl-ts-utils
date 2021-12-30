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

import { Key as InkKey } from "ink"
import _ from "lodash"
import { KeyBindingsForActions } from "./use-keyboard"

export const createNewKeyPressesToActionMap = (): KeyBindingsForActions => new Map()

/**
 * https://www.nadershamma.dev/blog/2019/how-to-access-object-properties-dynamically-using-bracket-notation-in-typescript/
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types
 */
const specialKeysPropertyNames: Array<keyof SpecialKey> = [
  "upArrow",
  "downArrow",
  "leftArrow",
  "rightArrow",
  "pageDown",
  "pageUp",
  "return",
  "escape",
  "tab",
  "backspace",
  "delete",
]

const modifierKeysPropertyNames: Array<keyof ModifierKey> = ["meta", "ctrl", "shift"]

export interface ModifierKey {
  ctrl: boolean
  /**
   * Shift key was pressed.
   */
  shift: boolean
  /**
   * Tab key was pressed.
   */
  /**
   * [Meta key](https://en.wikipedia.org/wiki/Meta_key) was pressed.
   */
  meta: boolean
}

export interface SpecialKey {
  /**
   * Up arrow key was pressed.
   */
  upArrow: boolean
  /**
   * Down arrow key was pressed.
   */
  downArrow: boolean
  /**
   * Left arrow key was pressed.
   */
  leftArrow: boolean
  /**
   * Right arrow key was pressed.
   */
  rightArrow: boolean
  /**
   * Page Down key was pressed.
   */
  pageDown: boolean
  /**
   * Page Up key was pressed.
   */
  pageUp: boolean
  /**
   * Return (Enter) key was pressed.
   */
  return: boolean
  /**
   * Escape key was pressed.
   */
  escape: boolean
  /**
   * Ctrl key was pressed.
   */
  tab: boolean
  /**
   * Backspace key was pressed.
   */
  backspace: boolean
  /**
   * Delete key was pressed.
   */
  delete: boolean
}

/**
 * A key press can be one of three things:
 * 1. A char & Modifier keys (shift, meta, ctrl).
 * 2. A special key (enter, left, right, backspace, etc) & Modifier keys.
 * 3. Just modifier keys. <- Not supported yet (TODO: gh issue for planned Rust impl)
 *
 * Currently this works for Ink's abstraction of key presses (via useInput) and it works when
 * directly using Node.js readline's raw mode (keypress events). Howeever, there are severe
 * limitations in both Ink and Node.js's handling of keypresses into a terminal that will
 * require this functionality to be written natively in Rust (see gh issue above).
 */
export class UserInputKeyPress {
  readonly _key: (SpecialKey & ModifierKey) | undefined
  readonly _input: string | undefined

  /** Deep copy all the provided arguments. */
  constructor(key?: (SpecialKey & ModifierKey) | InkKey, input?: string) {
    if (key) this._key = _.cloneDeep(key)
    if (input) this._input = input.slice()
  }

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

  setModifierKey = (modifier: "shift" | "ctrl" | "meta", value: boolean): void => {
    if (!this._key) return
    switch (modifier) {
      case "shift": {
        this._key.shift = value
        break
      }
      case "meta": {
        this._key.meta = value
        break
      }
      case "ctrl": {
        this._key.ctrl = value
        break
      }
    }
  }

  /** Key is special if it can be pressed independently of input, eg: "upArrow" and "downArrow". */
  isSpecialKey = (): boolean => {
    const { _key } = this
    if (!_key) return false
    for (const propertyName of specialKeysPropertyNames) if (_key[propertyName]) return true
    return false
  }

  /**
   * Key is modifier if "ctrl", "meta", or "shift" is true.
   */
  isModifierKey = (): boolean => {
    const { _key } = this
    if (!_key) return false
    for (const propertyName of modifierKeysPropertyNames) if (_key[propertyName]) return true
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

    const returnValue = new Array<string>()
    const propertiesSpecialKey: PropertyFlags<SpecialKey> = {
      backspace: _key.backspace,
      delete: _key.delete,
      downArrow: _key.downArrow,
      escape: _key.escape,
      leftArrow: _key.leftArrow,
      pageDown: _key.pageDown,
      pageUp: _key.pageUp,
      return: _key.return,
      rightArrow: _key.rightArrow,
      tab: _key.tab,
      upArrow: _key.upArrow,
    }
    const propertiesModifierKey: PropertyFlags<ModifierKey> = {
      ctrl: _key.ctrl,
      meta: _key.meta,
      shift: _key.shift,
    }
    for (const key in propertiesSpecialKey) {
      if (propertiesSpecialKey[key]) returnValue.push(key.toLowerCase())
    }
    for (const key in propertiesModifierKey) {
      // https://alligator.io/js/push-pop-shift-unshift-array-methods/
      if (propertiesModifierKey[key]) returnValue.unshift(key.toLowerCase())
    }
    if (returnValue.length === 0) return ""
    else return returnValue.join("+")
  }

  // https://developerlife.com/2021/07/02/nodejs-typescript-handbook/#user-defined-type-guards
  static isKeyType = (param: any): param is SpecialKey & ModifierKey => {
    const key = param as SpecialKey & ModifierKey
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
