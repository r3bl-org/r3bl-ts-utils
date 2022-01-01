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

import {
  attachToReadlineKeypress, createFromKeypress, detachFromReadlineKeypress, Keypress,
  NodeKeypressFn, ReadlineKey, TextColor
} from "../../index"

namespace nodejs_keypress_readline { // eslint-disable-line
  // Data.
  let isAttached = false
  
  // Main program.
  export const main = () => {
    printInstructions()
    isAttached = attachToReadlineKeypress(onKeypress)
    console.log(isAttached ?
      TextColor.builder.bold.green.build()("raw mode & listener attached") :
      TextColor.builder.bold.red.build()("not raw mode & listener not attached")
    )
  }
  
  // Handle keypress events from Node.js.
  const onKeypress: NodeKeypressFn = (input: string, key: ReadlineKey) => {
    printInputAndKey(input, key)
    const keyPress = createFromKeypress(key, input)
    keyPress.isSpecialKey() ? printSpKey(keyPress) : printRegularKey(keyPress)
    keyPress.matches("ctrl+c") ? exit() : undefined
    
    function exit() {
      if (isAttached) {
        detachFromReadlineKeypress(onKeypress)
        console.log(TextColor.builder.bold.cyan.build()("detaching listener"))
      }
      process.exit()
    }
  }
  
  // Debug.
  const printInstructions = (): void => {
    console.log(TextColor.builder.gray.build()("Type any key, press ctrl+c to exit"))
  }
  
  const printInputAndKey = (input: string, key: ReadlineKey): void => {
    console.log(
      TextColor.builder.magenta.build()("input"),
      input ? `[${input}], length:${input.length}` : "n/a"
    )
    console.log(TextColor.builder.magenta.build()("key"), key ? key : "")
  }
  
  const printSpKey = (spKey: Readonly<Keypress>): void => {
    console.log(TextColor.builder.bgYellow.black.underline.build()(spKey.toString()))
  }
  
  const printRegularKey = (spKey: Readonly<Keypress>): void => {
    console.log(TextColor.builder.bold.bgWhite.black.underline.build()(
      " " + spKey.toString() + " "))
  }
}

nodejs_keypress_readline.main()