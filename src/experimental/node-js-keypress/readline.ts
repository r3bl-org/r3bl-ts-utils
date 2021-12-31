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

import readline from "readline"
import { _also, ReadlineKey, TextColor, UserInputKeyPress } from "../../index"
import { keyCodeMap, keyNameMap, keySequenceMap } from "./key-map-config"

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
 * TODO: https://github.com/r3bl-org/r3bl-cmdr/issues/1
 */

namespace nodejs_keypress_readline {
  // Types, interfaces, data classes / structs.
  type Stdin = NodeJS.ReadStream & { fd: 0 }
  
  // Main program.
  export const main = () => {
    printInstructions()
    _also(process.stdin as Stdin, it => {
      readline.emitKeypressEvents(it)
      it.setRawMode(true)
      it.setEncoding("utf-8")
    })
      .on("keypress", onKeypress)
  }
  
  // Handle keypress events from Node.js.
  const onKeypress = (input: string, key: ReadlineKey): void => {
    printInputAndKey(input, key)
    
    // Check for special keys.
    const spKey = tryToFindSpecialKeyInMap(key)
    if (spKey) printSpKey(spKey)
    
    // Regular key.
    if (!spKey) {
      const regularKey = UserInputKeyPress.createFromKeypress(key, input)
      printRegularKey(regularKey)
    }
    
    // Check for exit.
    if (key && key.ctrl && key.name == "c") process.exit()
  }
  
  /**
   * First search key.code, then key.name, and finally key.sequence.
   */
  function tryToFindSpecialKeyInMap(key: ReadlineKey): UserInputKeyPress | undefined {
    let returnValue: UserInputKeyPress | undefined = undefined
    // Check key.code.
    if (key.code)
      for (let [ partialSequence, keyPress ] of keyCodeMap.entries()) {
        if (key.code.includes(partialSequence)) {
          returnValue = keyPress
          break
        }
      }
    // Check key.name.
    if (key.name)
      for (let [ partialSequence, keyPress ] of keyNameMap.entries()) {
        if (key.name.includes(partialSequence)) {
          returnValue = keyPress
          break
        }
      }
    // Check key.sequence.
    if (key.sequence)
      for (let [ partialSequence, keyPress ] of keySequenceMap.entries()) {
        if (key.sequence.includes(partialSequence)) {
          return keyPress
          break
        }
      }
    // Check for modifiers to be set.
    if (returnValue) {
      if (key.shift) returnValue.setModifierKey("shift", true)
      if (key.meta) returnValue.setModifierKey("meta", true)
      if (key.ctrl) returnValue.setModifierKey("ctrl", true)
    }
    return returnValue
  }
  
  
  // Debug.
  const printInstructions = (): void => {
    console.log(TextColor.builder.gray.build()("Type any key, press ctrl+c to exit"))
  }
  
  const printInputAndKey = (input: string, key: ReadlineKey): void => {
    console.log(
      TextColor.builder.magenta.build()("input"),
      input ? "[" + input + "], length:" + input.length : "n/a"
    )
    console.log(TextColor.builder.magenta.build()("key"), key ? key : "")
  }
  
  const printSpKey = (spKey: UserInputKeyPress): void => {
    console.log(TextColor.builder.bgYellow.black.underline.build()(spKey.toString()))
  }
  
  const printRegularKey = (spKey: UserInputKeyPress): void => {
    console.log(TextColor.builder.bold.bgYellow.black.underline.build()(
      " " + spKey.toString() + " "))
  }
  
}

nodejs_keypress_readline.main()