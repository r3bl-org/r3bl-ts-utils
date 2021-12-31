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

// Constructor vs object literal:
// https://medium.com/@mandeepkaur1/object-literal-vs-constructor-in-javascript-df143296b816
// Object literals are singletons that are public. Constructors make unique instances.

export class ModifierKey {
  ctrl: boolean = false
  /**
   * Shift key was pressed.
   */
  shift: boolean = false
  /**
   * Tab key was pressed.
   */
  /**
   * [Meta key](https://en.wikipedia.org/wiki/Meta_key) was pressed.
   */
  meta: boolean = false
}

export class SpecialKey {
  /**
   * Up arrow key was pressed.
   */
  upArrow: boolean = false
  /**
   * Down arrow key was pressed.
   */
  downArrow: boolean = false
  /**
   * Left arrow key was pressed.
   */
  leftArrow: boolean = false
  /**
   * Right arrow key was pressed.
   */
  rightArrow: boolean = false
  /**
   * Page Down key was pressed.
   */
  pageDown: boolean = false
  /**
   * Page Up key was pressed.
   */
  pageUp: boolean = false
  /**
   * Return (Enter) key was pressed.
   */
  return: boolean = false
  /**
   * Escape key was pressed.
   */
  escape: boolean = false
  /**
   * Ctrl key was pressed.
   */
  tab: boolean = false
  /**
   * Backspace key was pressed.
   */
  backspace: boolean = false
  /**
   * Delete key was pressed.
   */
  delete: boolean = false
}

/**
 * https://www.nadershamma.dev/blog/2019/how-to-access-object-properties-dynamically-using-bracket-notation-in-typescript/
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types
 */
export const specialKeysPropertyNames: Array<keyof SpecialKey> = [
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
export const modifierKeysPropertyNames: Array<keyof ModifierKey> = [ "shift", "ctrl", "meta" ]

export class KeyPress implements ModifierKey, SpecialKey {
  public backspace = false
  public ctrl = false
  public delete = false
  public downArrow = false
  public escape = false
  public leftArrow = false
  public meta = false
  public pageDown = false
  public pageUp = false
  public return = false
  public rightArrow = false
  public shift = false
  public tab = false
  public upArrow = false
  
  constructor(key?: SpecialKey & ModifierKey) {
    if (!key) return
    
    specialKeysPropertyNames.forEach((propName: keyof SpecialKey) => {
      if (key[propName]) this[propName] = Boolean(key[propName])
    })
    modifierKeysPropertyNames.forEach((propName: keyof ModifierKey) => {
      if (key[propName]) this[propName] = Boolean(key[propName])
    })
  }
}

export class KeyCreator {
  // Special keys.
  static get emptyKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get upKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: true, // 👍
    })
  }
  
  static get downKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: true, // 👍
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get leftKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: true, // 👍
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get rightKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: true, // 👍
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get pageUpKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: true, // 👍
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get pageDownKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: true, // 👍
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get escapeKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: true, // 👍
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get returnKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: true, // 👍
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get tabKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: true, // 👍
      upArrow: false,
    })
  }
  
  static get backspaceKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: true, // 👍
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get deleteKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: true, // 👍
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  // Modifier keys.
  static get ctrlKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: true, // 👍
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get metaKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: true, // 👍
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: false,
      tab: false,
      upArrow: false,
    })
  }
  
  static get shiftKey(): SpecialKey & ModifierKey {
    return new KeyPress({
      backspace: false,
      ctrl: false,
      delete: false,
      downArrow: false,
      escape: false,
      leftArrow: false,
      meta: false,
      pageDown: false,
      pageUp: false,
      return: false,
      rightArrow: false,
      shift: true, // 👍
      tab: false,
      upArrow: false,
    })
  }
}

export interface ReadlineKey {
  sequence?: string,
  name?: string,
  code?: string,
  ctrl: boolean,
  meta: boolean,
  shift: boolean,
}