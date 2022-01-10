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

import _ from "lodash"
import { _also } from "../kotlin-lang-utils"
import { colors, FormatFn } from "./colors"

export class TextColor {
  private readonly formatFns = new Array<FormatFn>()
  
  static get builder(): TextColor {
    return new TextColor()
  }
  
  build = (): TextColor & FormatFn =>
    Object.assign(
      (text: string) => this.applyFormatting(text), // Callable via FormatFn signature.
      this
    )
  
  applyFormatting = (input: string): string => {
    let copy = input.slice()
    this.formatFns.forEach((fn) => (copy = fn(copy)))
    return copy
  }
  
  toString = () => `${this.formatFns.length}`
  
  // From colors.ts.
  
  get stripColors(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.stripColors))
  }
  
  get black(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.black))
  }
  
  get red(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.red))
  }
  
  get green(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.green))
  }
  
  get yellow(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.yellow))
  }
  
  get blue(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.blue))
  }
  
  get magenta(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.magenta))
  }
  
  get cyan(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.cyan))
  }
  
  get white(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.white))
  }
  
  get gray(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.gray))
  }
  
  get grey(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.grey))
  }
  
  get bgBlack(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.bgBlack))
  }
  
  get bgRed(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.bgRed))
  }
  
  get bgGreen(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.bgGreen))
  }
  
  get bgYellow(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.bgYellow))
  }
  
  get bgBlue(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.bgBlue))
  }
  
  get bgMagenta(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.bgMagenta))
  }
  
  get bgCyan(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.bgCyan))
  }
  
  get bgWhite(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.bgWhite))
  }
  
  get reset(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.reset))
  }
  
  get bold(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.bold))
  }
  
  get dim(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.dim))
  }
  
  get italic(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.italic))
  }
  
  get underline(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.underline))
  }
  
  get inverse(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.inverse))
  }
  
  get hidden(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.hidden))
  }
  
  get strikethrough(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.strikethrough))
  }
  
  get rainbow(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.rainbow))
  }
  
  get redwhiteblue(): TextColor {
    return _also(this, (it) => it.formatFns.push(colors.redwhiteblue))
  }
  
  get randomFgColor(): TextColor {
    const randomColor = _.sample([
      colors.black,
      colors.red,
      colors.green,
      colors.yellow,
      colors.blue,
      colors.magenta,
      colors.cyan,
      colors.white,
      colors.gray,
      colors.grey,
    ])!
    return _also(this, (it) => it.formatFns.push(randomColor))
  }
}
