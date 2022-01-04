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

import { _let } from "../kotlin-lang-utils"
import { FormatFn, TextColor } from "./style-builder"

export const Formatter = _let(
  {
    headerUnderlineFn: TextColor.builder.underline.blue.build(),
    headerFn: TextColor.builder.blue.build(),
    headerMessageFn: TextColor.builder.cyan.bold.build(),
    primaryFn: TextColor.builder.yellow.bold.build(),
    secondaryFn: TextColor.builder.underline.cyan.build(),
  },
  (it) => it as Readonly<typeof it>
)

export interface ColorConsoleIF {
  (text: string): ColorConsole
  call(text: string): ColorConsole
  apply(text: string): ColorConsole
  consoleLog(): void
  consoleError(): void
  toString(): string
}

export class ColorConsole {
  private readonly myStyleFn: FormatFn
  private myText = ""
  
  static create = (style: FormatFn): ColorConsoleIF => {
    const instance = new ColorConsole(style)
    return Object.assign((text: string) => instance.call(text), instance) as ColorConsoleIF
  }
  
  constructor(style: FormatFn) {
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

export const Styles: { Primary: FormatFn; Secondary: FormatFn } = {
  Primary: Formatter.primaryFn,
  Secondary: Formatter.secondaryFn,
}
export const StyledColorConsole: { Secondary: ColorConsoleIF; Primary: ColorConsoleIF } = {
  Primary: ColorConsole.create(Styles.Primary),
  Secondary: ColorConsole.create(Styles.Secondary),
}
