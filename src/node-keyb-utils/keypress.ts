/*
 * Copyright 2022 R3BL LLC. All rights reserved.
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

import { _let } from "../kotlin-lang-utils"
import { createMutableCopyOf } from "./builder-general"
import {
  ModifierKey, modifierKeysPropertyNames, SpecialKey, specialKeysPropertyNames
} from "./keypress-constants"

/**
 * This class is immutable. In order to create an instance of it, please use the factory methods:
 * createFromInk, createFromKeypress, createCopyOf
 *
 * Once an instance is created, only two mutation methods are provided which don't modify the
 * original instance and return a newly deep copied instance:
 * setModifierKeyFrom, setModifierKey
 *
 * A key press can be one of three things:
 * 1. A char & Modifier keys (shift, meta, ctrl).
 * 2. A special key (enter, left, right, backspace, etc) & Modifier keys.
 * 3. Just modifier keys (not currently supported)
 *
 * ENHANCEMENT: https://github.com/r3bl-org/r3bl-cmdr/issues/1
 *
 * Currently this works for Ink's abstraction of key presses (via useInput) and it works when
 * directly using Node.js readline's raw mode (keypress events). Howeever, there are severe
 * limitations in both Ink and Node.js's handling of keypresses into a terminal that will
 * require this functionality to be written natively in Rust (see gh issue above).
 */
export class Keypress {
  readonly _key: (SpecialKey & ModifierKey) | undefined
  readonly _input: string | undefined
  
  // Constructor and mutators.
  /**
   * Don't deep copy all the provided arguments, use them as is. Use builders instead.
   */
  private constructor(key?: (SpecialKey & ModifierKey), input?: string) {
    if (key) this._key = key
    if (input) this._input = input
  }
  
  static buildMutable = (
    key?: SpecialKey & ModifierKey,
    input?: string
  ): Keypress => new Keypress(key, input)
  
  /** @immutable */
  static buildImmutable = (
    key?: SpecialKey & ModifierKey,
    input?: string
  ): Readonly<Keypress> => Object.freeze(new Keypress(key, input))
  
  /** @immutable */
  makeImmutable = (): Readonly<Keypress> => {
    return Object.freeze(this)
  }
  
  /** @immutable */
  setModifierKey = (modifier: "shift" | "ctrl" | "meta", value: boolean): Readonly<Keypress> =>
    _let(
      createMutableCopyOf(this._key, this._input),
      copyOfSelf => {
        copyOfSelf._key ? copyOfSelf._key[modifier] = value : undefined
        return Object.freeze(copyOfSelf)
      }
    )
  
  // Accessors.
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
    
    return _let(new Array<string>(), returnValue => {
      specialKeysPropertyNames.forEach((propName: keyof SpecialKey) => {
        if (_key[propName]) returnValue.push(propName.toLowerCase())
      })
      modifierKeysPropertyNames.forEach((propName: keyof ModifierKey) => {
        // https://alligator.io/js/push-pop-shift-unshift-array-methods/
        if (_key[propName]) returnValue.unshift(propName.toLowerCase())
      })
      if (returnValue.length === 0) return ""
      else return returnValue.join("+")
    })
  }
}
