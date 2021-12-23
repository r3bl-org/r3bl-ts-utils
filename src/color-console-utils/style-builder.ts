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
  static get builder(): TextColor {
    return new TextColor()
  }
  
  private readonly _stack = new Array<FormatFn>()
  
  constructor(otherStyles?: FormatFn[]) {
    if (otherStyles) this._stack = otherStyles
  }
  
  toString: () => string = () => `${this._stack.length}`
  
  build: () => TextColor & FormatFn =
    () => Object.assign(
      (text: string) => this.applyFormatting(text), // Callable via FormatFn signature.
      this,
    )
  
  applyFormatting = (input: string): string => _also(
    { output: input.slice() }, // https://reactgo.com/javascript-string-copy/
    holder => this._stack.forEach(
      formatFn => holder.output = formatFn(holder.output))
  ).output
  
  // From colors.js (safe.d.ts). https://github.com/Marak/colors.js
  
  get strip(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.strip)))
  }
  
  get stripColors(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.stripColors)))
  }
  
  get black(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.black)))
  }
  
  get red(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.red)))
  }
  
  get green(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.green)))
  }
  
  get yellow(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.yellow)))
  }
  
  get blue(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.blue)))
  }
  
  get magenta(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.magenta)))
  }
  
  get cyan(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.cyan)))
  }
  
  get white(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.white)))
  }
  
  get gray(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.gray)))
  }
  
  get grey(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.grey)))
  }
  
  get bgBlack(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.bgBlack)))
  }
  
  get bgRed(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.bgRed)))
  }
  
  get bgGreen(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.bgGreen)))
  }
  
  get bgYellow(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.bgYellow)))
  }
  
  get bgBlue(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.bgBlue)))
  }
  
  get bgMagenta(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.bgMagenta)))
  }
  
  get bgCyan(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.bgCyan)))
  }
  
  get bgWhite(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.bgWhite)))
  }
  
  get reset(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.reset)))
  }
  
  get bold(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.bold)))
  }
  
  get dim(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.dim)))
  }
  
  get italic(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.italic)))
  }
  
  get underline(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.underline)))
  }
  
  get inverse(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.inverse)))
  }
  
  get hidden(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.hidden)))
  }
  
  get strikethrough(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.strikethrough)))
  }
  
  get rainbow(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.rainbow)))
  }
  
  get america(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.america)))
  }
  
  get trap(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.trap)))
  }
  
  get random(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.random)))
  }
  
  get zalgo(): TextColor {
    return new TextColor(_also(this._stack, it => it.push(colors.zalgo)))
  }
}
