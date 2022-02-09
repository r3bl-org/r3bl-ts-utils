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

import { _also, _let } from "../lang-utils/kotlin-lang-utils"
import { Formatter, StyledColorConsole } from "./color-console"
import {
  defaultPostFix,
  defaultRepeatChar,
  defaultShortLeftRepeatChar,
  defaultShortRightRepeatChar,
  maxWidth,
  padding,
  regExForDefaultRepeatChar,
  spaceChar
} from "./internal-constants"

export const printHeader = (message: string, postFix = defaultPostFix) => {
  const isTooWideChar = message.length > maxWidth ? "\n" : ""

  const spans = _also(new Array<string>(3), (spans) => {
    const headerLine = getHeaderLine(message, defaultRepeatChar)
    const headerLineUnderscores = headerLine.replace(regExForDefaultRepeatChar, spaceChar)

    let headerLeft, headerRight
    if (isTooWideChar) {
      headerLeft = Formatter.headerUnderlineFn(headerLineUnderscores)
      headerRight = Formatter.headerUnderlineFn(headerLineUnderscores)
    } else {
      headerLeft = Formatter.headerUnderlineFn(getHeaderLine(message, defaultShortLeftRepeatChar))
      headerRight = Formatter.headerFn(getHeaderLine(message, defaultShortRightRepeatChar))
    }

    spans[ 0 ] = headerLeft
    spans[ 1 ] = Formatter.headerMessageFn(`${spaceChar}${message}${spaceChar}`)
    spans[ 2 ] = headerRight
  })

  const output = spans.join(isTooWideChar ? "\n" : "")

  console.log(output + postFix)
}

const getHeaderLine = (message: string, repeatChar: string): string =>
  _let(message.length, (count) => repeatChar.repeat(count + padding))

export const sleep = (time_ms = 500): Promise<void> => {
  const sprites = [ "-", "\\", "-", "/" ]

  let count = 0
  const printDotsInterval = setInterval(() => {
    const sprite: string = sprites[ count++ % sprites.length ]?.toString() ?? ""
    StyledColorConsole.Primary("Sleep " + sprite).consoleLogInPlace()
  }, 100)

  return new Promise<void>((resolveFn) => {
    setTimeout(() => {
      clearInterval(printDotsInterval)
      console.log()
      resolveFn()
    }, time_ms)
  })
}
