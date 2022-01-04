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

/**
 * Classes and types are provided in this class that describe key presses that can be typed in
 * from a terminal. These are not tied to any specific implementation of Node.js readline for
 * eg, or Ink. And in the future w/ Rust implementations of native keypress listeners these can
 * be used and extended as well.
 *
 * Please note that it is unsafe to use mutable singleton constants. This is very easy to do with
 * constants pointing to object literals that are exported. This is why all the getters in this
 * class return a new object instance. Object literals are singletons that are public and all their
 * properties can be modified publicly. Constructors make unique instances. More info:
 * https://medium.com/@mandeepkaur1/object-literal-vs-constructor-in-javascript-df143296b816
 */

export class ModifierKey {
  /** Ctrl key was pressed. */
  ctrl = false
  /** Shift key was pressed. */
  shift = false
  /** [Meta key](https://en.wikipedia.org/wiki/Meta_key) was pressed. */
  meta = false
}

export class SpecialKey {
  /** Up arrow key was pressed. */
  upArrow = false
  /** Down arrow key was pressed. */
  downArrow = false
  /** Left arrow key was pressed. */
  leftArrow = false
  /** Right arrow key was pressed. */
  rightArrow = false
  /** Page Down key was pressed. */
  pageDown = false
  /** Page Up key was pressed. */
  pageUp = false
  /** Return (Enter) key was pressed. */
  return = false
  /** Escape key was pressed. */
  escape = false
  /** Ctrl key was pressed. */
  tab = false
  /** Backspace key was pressed. */
  backspace = false
  /** Delete key was pressed. */
  delete = false
  /** Space key was pressed. */
  space = false
  /** Home key was pressed. */
  home = false
  /** End key was pressed. */
  end = false
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
  "space",
  "home",
  "end",
]
export const modifierKeysPropertyNames: Array<keyof ModifierKey> = ["shift", "ctrl", "meta"]

/** Data class that holds information about modifiery and special key. */
export class KeyData implements ModifierKey, SpecialKey {
  public space = false
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
  public home = false
  public end = false

  constructor(key?: SpecialKey & ModifierKey) {
    if (!key) return
    specialKeysPropertyNames.forEach((propName: keyof SpecialKey) =>
      key[propName] ? (this[propName] = Boolean(key[propName])) : undefined
    )
    modifierKeysPropertyNames.forEach((propName: keyof ModifierKey) =>
      key[propName] ? (this[propName] = Boolean(key[propName])) : undefined
    )
  }
}

/**
 * All the getters return a new instance of SpecialKey & ModifierKey which is mutable, and meant
 * to be modified.
 */
export class KeyCreator {
  // Special keys.
  static get emptyKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get homeKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: true, // 👍
      end: false,
    })
  }

  static get endKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: true, // 👍
    })
  }

  static get upKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get downKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get leftKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get rightKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get pageUpKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get pageDownKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get escapeKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get returnKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get tabKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get backspaceKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get spaceKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: true, // 👍
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
      home: false,
      end: false,
    })
  }

  static get deleteKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  // Modifier keys.
  static get ctrlKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get metaKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }

  static get shiftKey(): SpecialKey & ModifierKey {
    return new KeyData({
      space: false,
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
      home: false,
      end: false,
    })
  }
}

// https://developerlife.com/2021/07/02/nodejs-typescript-handbook/#user-defined-type-guards
export const isKeyType = (param: any): param is SpecialKey & ModifierKey => {
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
