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

import { _also } from "../lang-utils/kotlin-lang-utils"
import { Keypress } from "./keypress"
import { createMutableCopyOf } from "./keypress-builder-general"
import { KeyCreator } from "./keypress-constants"

/*
 * Unicode, UTF-8, JS, hex encoding:
 * - https://flaviocopes.com/javascript-unicode/
 * - https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/#hexadecimal-escape-sequence
 * Unicode hex character to symbol (eg: '[' => '\x5b')
 * - https://www.utf8-chartable.de/
 * ASCII:
 * - https://www.ascii-code.com/
 *
 * Here's an example of a string generated when leftArrow is typed in the console: '\x1B[C'. Hex
 * escape sequence is the shortest form. Hex accept two digits (a hex number) after '\x' to
 * represent a single character. However, each character in the string is actually a hex number! In
 * order to translate the string into their numbers, we can use https://www.ascii-code.com/.
 *
 * Using these resources, we see that '\x1B[C' is broken down like so:
 * - '\x1' becomes '\x31'
 * - '\xB' becomes '\x42'
 * - '\x[' becomes '\x5B'
 * - '\xC' becomes '\x43'
 *
 * ENHANCEMENT: https://github.com/r3bl-org/r3bl-cmdr/issues/1
 */

/**
 * Note that the value of the map entry is a function that returns a copy of a key, so that there is
 * no chance of creating mutable constants that are shared publicly. The object that is returned is
 * meant to be modified (it is mutable) by other parts of the code.
 */
type InputToKeyPressDictionary = Map<string, () => Keypress>

export const keyCodeMap: InputToKeyPressDictionary = _also(
  new Map() as InputToKeyPressDictionary,
  (map) => {
    map
      .set("[D", () => createMutableCopyOf(KeyCreator.leftKey, undefined))
      .set("[C", () => createMutableCopyOf(KeyCreator.rightKey, undefined))
      .set("[A", () => createMutableCopyOf(KeyCreator.upKey, undefined))
      .set("[B", () => createMutableCopyOf(KeyCreator.downKey, undefined))
      .set("[6~", () => createMutableCopyOf(KeyCreator.pageDownKey, undefined))
      .set("[5~", () => createMutableCopyOf(KeyCreator.pageUpKey, undefined))
      .set("[H", () => createMutableCopyOf(KeyCreator.homeKey, undefined))
      .set("[F", () => createMutableCopyOf(KeyCreator.endKey, undefined))
  }
)

export const keyNameMap: InputToKeyPressDictionary = _also(
  new Map() as InputToKeyPressDictionary,
  (map) => {
    map
      .set("space", () => createMutableCopyOf(KeyCreator.spaceKey, undefined))
      .set("backspace", () => createMutableCopyOf(KeyCreator.backspaceKey, undefined))
      .set("delete", () => createMutableCopyOf(KeyCreator.deleteKey, undefined))
      .set("return", () => createMutableCopyOf(KeyCreator.returnKey, undefined))
      .set("tab", () => createMutableCopyOf(KeyCreator.tabKey, undefined))
      .set("escape", () => createMutableCopyOf(KeyCreator.escapeKey, undefined))
  }
)

export const keySequenceMap: InputToKeyPressDictionary = _also(
  new Map() as InputToKeyPressDictionary,
  (map) => {
    map
      .set("7F", () => createMutableCopyOf(KeyCreator.backspaceKey, undefined))
      .set("1B", () => createMutableCopyOf(KeyCreator.escapeKey, undefined))
      .set("[3~", () => createMutableCopyOf(KeyCreator.deleteKey, undefined))
      .set("\r", () => createMutableCopyOf(KeyCreator.returnKey, undefined))
      .set("\t", () => createMutableCopyOf(KeyCreator.tabKey, undefined))
  }
)

/**
 * This describes a keypress event that comes in from Node.js readline. The sequence, name, and code
 * properties are optional. Run the `npm run exp-node-readline-keypress-logger` script (which runs
 * readline-keypress-logger.ts in experimental) in order to see this in action.
 */
export interface ReadlineKey {
  sequence?: string
  name?: string
  code?: string
  ctrl: boolean
  meta: boolean
  shift: boolean
}
