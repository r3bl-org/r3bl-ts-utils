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

// TODO: Remove dependency on Chalk since it breaks TypeScript (v 5.0.0 doesn't work).
// TypeScript issues w/ Chalk.
// https://github.com/chalk/chalk/issues/281#issuecomment-401591747
// https://github.com/chalk/chalk/issues/215
import * as _kt from "./kotlin-lang-utils"

const maxWidth = 100 / 3
const defaultRepeatChar = "-"
const regExForDefaultRepeatChar = new RegExp(defaultRepeatChar, "g")
const defaultShortLeftRepeatChar = ">"
const defaultShortRightRepeatChar = "<"
const padding = 2
const defaultPostFix = ""
const spaceChar = " "

type ChalkFn = (text: string) => string

namespace Formatter {
  export const textStyleHeaderUnderlineFn: ChalkFn = (text: string) => text
  export const textStyleHeaderFn: ChalkFn = (text: string) => text
  export const textStyleHeaderBodyFn: ChalkFn = (text: string) => text
  export const primaryFn: ChalkFn = text => text
  export const secondaryFn: ChalkFn = text => text
}

export const printHeader = (message: string, postFix = defaultPostFix) => {
  const isTooWide = message.length > maxWidth ? "\n" : ""
  
  const spans = _kt._also(new Array<string>(3), (spans) => {
    const headerLine = getHeaderLine(message, defaultRepeatChar)
    const headerLineUnderscores = headerLine.replace(regExForDefaultRepeatChar, spaceChar)
    
    let headerLeft, headerRight
    if (isTooWide) {
      headerLeft = Formatter.textStyleHeaderUnderlineFn(headerLineUnderscores)
      headerRight = Formatter.textStyleHeaderUnderlineFn(headerLineUnderscores)
    } else {
      headerLeft = Formatter.textStyleHeaderUnderlineFn(getHeaderLine(
        message,
        defaultShortLeftRepeatChar
      ))
      headerRight = Formatter.textStyleHeaderFn(getHeaderLine(message, defaultShortRightRepeatChar))
    }
    
    spans[0] = headerLeft
    spans[1] = Formatter.textStyleHeaderBodyFn(`${spaceChar}${message}${spaceChar}`)
    spans[2] = headerRight
  })
  
  const output = spans.join(isTooWide ? "\n" : "")
  
  console.log(output + postFix)
}

const getHeaderLine = (message: string, repeat: string): string =>
  repeat.repeat(message.length + padding)

export interface ColorConsoleIF {
  (text: string): ColorConsole
  
  call(text: string): ColorConsole
  
  apply(text: string): ColorConsole
  
  consoleLog(): void
  
  consoleError(): void
  
  toString(): string
}

export class ColorConsole {
  private readonly myStyleFn: ChalkFn
  private myText = ""
  
  static create = (style: ChalkFn): ColorConsoleIF => {
    const instance = new ColorConsole(style)
    return Object.assign((text: string) => instance.call(text)) as ColorConsoleIF
  }
  
  constructor(style: ChalkFn) {
    this.myStyleFn = style
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
    process.stdout.write(Styles.Primary(this.toString()))
    printNewline ? process.stdout.write("\n") : null
  }
  
  consoleError = (): void => {
    console.error(this.toString())
  }
  
  toString = (): string => this.myStyleFn(this.myText)
}

export const Styles: { Primary: ChalkFn, Secondary: ChalkFn } = {
  Primary: Formatter.primaryFn,
  Secondary: Formatter.secondaryFn,
}

export const StyledColorConsole: { Secondary: ColorConsoleIF; Primary: ColorConsoleIF } = {
  Primary: ColorConsole.create(Styles.Primary),
  Secondary: ColorConsole.create(Styles.Secondary),
}
