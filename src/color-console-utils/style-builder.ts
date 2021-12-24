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

import colors from "colors/safe"
import { _also } from "../kotlin-lang-utils"

export type FormatFn = (text: string) => string

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
    this.formatFns.forEach(fn => copy = fn(copy))
    return copy
  }
  
  toString = () => `${this.formatFns.length}`
  
  // From colors.js (safe.d.ts). https://github.com/Marak/colors.js
  
  get strip(): TextColor {
    return _also(this, it => it.formatFns.push(colors.strip))
  }
  
  get stripColors(): TextColor {
    return _also(this, it => it.formatFns.push(colors.stripColors))
  }
  
  get black(): TextColor {
    return _also(this, it => it.formatFns.push(colors.black))
  }
  
  get red(): TextColor {
    return _also(this, it => it.formatFns.push(colors.red))
  }
  
  get green(): TextColor {
    return _also(this, it => it.formatFns.push(colors.green))
  }
  
  get yellow(): TextColor {
    return _also(this, it => it.formatFns.push(colors.yellow))
  }
  
  get blue(): TextColor {
    return _also(this, it => it.formatFns.push(colors.blue))
  }
  
  get magenta(): TextColor {
    return _also(this, it => it.formatFns.push(colors.magenta))
  }
  
  get cyan(): TextColor {
    return _also(this, it => it.formatFns.push(colors.cyan))
  }
  
  get white(): TextColor {
    return _also(this, it => it.formatFns.push(colors.white))
  }
  
  get gray(): TextColor {
    return _also(this, it => it.formatFns.push(colors.gray))
  }
  
  get grey(): TextColor {
    return _also(this, it => it.formatFns.push(colors.grey))
  }
  
  get bgBlack(): TextColor {
    return _also(this, it => it.formatFns.push(colors.bgBlack))
  }
  
  get bgRed(): TextColor {
    return _also(this, it => it.formatFns.push(colors.bgRed))
  }
  
  get bgGreen(): TextColor {
    return _also(this, it => it.formatFns.push(colors.bgGreen))
  }
  
  get bgYellow(): TextColor {
    return _also(this, it => it.formatFns.push(colors.bgYellow))
  }
  
  get bgBlue(): TextColor {
    return _also(this, it => it.formatFns.push(colors.bgBlue))
  }
  
  get bgMagenta(): TextColor {
    return _also(this, it => it.formatFns.push(colors.bgMagenta))
  }
  
  get bgCyan(): TextColor {
    return _also(this, it => it.formatFns.push(colors.bgCyan))
  }
  
  get bgWhite(): TextColor {
    return _also(this, it => it.formatFns.push(colors.bgWhite))
  }
  
  get reset(): TextColor {
    return _also(this, it => it.formatFns.push(colors.reset))
  }
  
  get bold(): TextColor {
    return _also(this, it => it.formatFns.push(colors.bold))
  }
  
  get dim(): TextColor {
    return _also(this, it => it.formatFns.push(colors.dim))
  }
  
  get italic(): TextColor {
    return _also(this, it => it.formatFns.push(colors.italic))
  }
  
  get underline(): TextColor {
    return _also(this, it => it.formatFns.push(colors.underline))
  }
  
  get inverse(): TextColor {
    return _also(this, it => it.formatFns.push(colors.inverse))
  }
  
  get hidden(): TextColor {
    return _also(this, it => it.formatFns.push(colors.hidden))
  }
  
  get strikethrough(): TextColor {
    return _also(this, it => it.formatFns.push(colors.strikethrough))
  }
  
  get rainbow(): TextColor {
    return _also(this, it => it.formatFns.push(colors.rainbow))
  }
  
  get america(): TextColor {
    return _also(this, it => it.formatFns.push(colors.america))
  }
  
  get trap(): TextColor {
    return _also(this, it => it.formatFns.push(colors.trap))
  }
  
  get random(): TextColor {
    return _also(this, it => it.formatFns.push(colors.random))
  }
  
  get zalgo(): TextColor {
    return _also(this, it => it.formatFns.push(colors.zalgo))
  }
}
