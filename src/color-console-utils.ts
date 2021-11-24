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

import * as _kt from "./kotlin-lang-utils"
import chalk from "chalk" // https://github.com/chalk/chalk/issues/281#issuecomment-401591747

const maxWidth = 100 / 3
const defaultRepeatChar = "-"
const regExForDefaultRepeatChar = new RegExp(defaultRepeatChar, "g")
const defaultShortLeftRepeatChar = ">"
const defaultShortRightRepeatChar = "<"
const padding = 2
const defaultPostFix = ""
const spaceChar = " "

const getHeaderLine = (message: string, repeat: string): string =>
  repeat.repeat(message.length + padding)

export const printHeader = (message: string, postFix = defaultPostFix) => {
  const isTooWide = message.length > maxWidth ? "\n" : ""

  const spans = _kt._also(new Array<string>(3), (spans) => {
    const headerLine = getHeaderLine(message, defaultRepeatChar)
    const headerLineUnderscores = headerLine.replace(regExForDefaultRepeatChar, spaceChar)

    let headerLeft, headerRight
    if (isTooWide) {
      headerLeft = textStyleHeaderUnderline(headerLineUnderscores)
      headerRight = textStyleHeaderUnderline(headerLineUnderscores)
    } else {
      headerLeft = textStyleHeaderUnderline(getHeaderLine(message, defaultShortLeftRepeatChar))
      headerRight = textStyleHeader(getHeaderLine(message, defaultShortRightRepeatChar))
    }

    spans[0] = headerLeft
    spans[1] = textStyleHeaderBody(`${spaceChar}${message}${spaceChar}`)
    spans[2] = headerRight
  })

  const output = spans.join(isTooWide ? "\n" : "")

  console.log(output + postFix)
}

const textStyleHeaderUnderline = chalk.underline.black.bgWhiteBright
const textStyleHeader = chalk.black.bgWhiteBright
const textStyleHeaderBody = chalk.bold.black.bgYellow

export interface ColorConsoleIF {
  (text: string): ColorConsole
  call(text: string): ColorConsole
  apply(text: string): ColorConsole
  consoleLog(): void
  consoleError(): void
  toString(): string
}

export class ColorConsole {
  private readonly myStyle: chalk.Chalk
  private myText = ""

  static create(style: chalk.Chalk): ColorConsoleIF {
    const instance = new ColorConsole(style)
    return Object.assign((text: string) => instance.call(text)) as ColorConsoleIF
  }

  constructor(style: chalk.Chalk) {
    this.myStyle = style
  }

  call = (text: string): ColorConsole => this.apply(text)

  apply = (text: string): ColorConsole => {
    this.myText = text
    return this
  }

  consoleLog = (prefixWithNewline = false): void => {
    prefixWithNewline ? console.log() : null
    console.log(this.toString())
  }

  // https://gist.githubusercontent.com/narenaryan/a2f4f8a3559d49ee2380aa17e7dc1dea/raw/d777cf7fad282d6bf1b00a0ec474e6430151b07f/streams_copy_basic.js
  consoleLogInPlace = (printNewline = false): void => {
    process.stdout.clearLine(-1)
    process.stdout.cursorTo(0)
    process.stdout.write(Styles.Primary.red(this.toString()))
    printNewline ? process.stdout.write("\n") : null
  }

  consoleError = (): void => {
    console.error(this.toString())
  }

  toString = (): string => this.myStyle(this.myText)
}

export const Styles = {
  Primary: chalk.bold.yellow.bgBlack,
  Secondary: chalk.underline.cyan.bgGray,
}

export const StyledColorConsole = {
  Primary: ColorConsole.create(Styles.Primary),
  Secondary: ColorConsole.create(Styles.Secondary),
}
