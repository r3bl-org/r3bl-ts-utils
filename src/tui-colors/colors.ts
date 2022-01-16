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

const colorCodes = Object.freeze({
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  brightRed: [91, 39],
  brightGreen: [92, 39],
  brightYellow: [93, 39],
  brightBlue: [94, 39],
  brightMagenta: [95, 39],
  brightCyan: [96, 39],
  brightWhite: [97, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],

  bgBrightRed: [101, 49],
  bgBrightGreen: [102, 49],
  bgBrightYellow: [103, 49],
  bgBrightBlue: [104, 49],
  bgBrightMagenta: [105, 49],
  bgBrightCyan: [106, 49],
  bgBrightWhite: [107, 49],
})

const getFormattedString = (color: keyof typeof colorCodes, text: string): string => {
  const [pre, post] = colorCodes[color]
  // eslint-disable-next-line
  return "\u001b[" + pre + "m" + text + "\u001b[" + post + "m"
}

export type FormatFn = (text: string) => string

// eslint-disable-next-line
export namespace colors {
  export const stripColors: FormatFn = (text: string): string =>
    // eslint-disable-next-line
    ("" + text).replace(/\x1B\[\d+m/g, "")

  export const black: FormatFn = (text: string): string => getFormattedString("black", text)

  export const red: FormatFn = (text: string): string => getFormattedString("red", text)

  export const green: FormatFn = (text: string): string => getFormattedString("green", text)

  export const yellow: FormatFn = (text: string): string => getFormattedString("yellow", text)

  export const blue: FormatFn = (text: string): string => getFormattedString("blue", text)

  export const magenta: FormatFn = (text: string): string => getFormattedString("magenta", text)

  export const cyan: FormatFn = (text: string): string => getFormattedString("cyan", text)

  export const white: FormatFn = (text: string): string => getFormattedString("white", text)

  export const gray: FormatFn = (text: string): string => getFormattedString("gray", text)

  export const grey: FormatFn = (text: string): string => getFormattedString("grey", text)

  export const bgBlack: FormatFn = (text: string): string => getFormattedString("bgBlack", text)

  export const bgRed: FormatFn = (text: string): string => getFormattedString("bgRed", text)

  export const bgGreen: FormatFn = (text: string): string => getFormattedString("bgGreen", text)

  export const bgYellow: FormatFn = (text: string): string => getFormattedString("bgYellow", text)

  export const bgBlue: FormatFn = (text: string): string => getFormattedString("bgBlue", text)

  export const bgMagenta: FormatFn = (text: string): string => getFormattedString("bgMagenta", text)

  export const bgCyan: FormatFn = (text: string): string => getFormattedString("bgCyan", text)

  export const bgWhite: FormatFn = (text: string): string => getFormattedString("bgWhite", text)

  export const reset: FormatFn = (text: string): string => getFormattedString("reset", text)

  export const bold: FormatFn = (text: string): string => getFormattedString("bold", text)

  export const dim: FormatFn = (text: string): string => getFormattedString("dim", text)

  export const italic: FormatFn = (text: string): string => getFormattedString("italic", text)

  export const underline: FormatFn = (text: string): string => getFormattedString("underline", text)

  export const inverse: FormatFn = (text: string): string => getFormattedString("inverse", text)

  export const hidden: FormatFn = (text: string): string => getFormattedString("hidden", text)

  export const strikethrough: FormatFn = (text: string): string =>
    getFormattedString("strikethrough", text)

  export const rainbow: FormatFn = (text: string): string => {
    const rainbowColors: Array<keyof typeof colorCodes> = [
      "red",
      "yellow",
      "green",
      "cyan",
      "blue",
      "magenta",
    ]
    let output = ""
    for (let i = 0; i < text.length; i++) {
      const letter = text[i]!
      const color: keyof typeof colorCodes = rainbowColors[i % rainbowColors.length]!
      output = output + getFormattedString(color, letter)
    }
    return output
  }

  export const redwhiteblue: FormatFn = (text: string): string => {
    const rwbColors: Array<keyof typeof colorCodes> = ["red", "white", "blue"]
    let output = ""
    for (let i = 0; i < text.length; i++) {
      const letter = text[i]!
      const color: keyof typeof colorCodes = rwbColors[i % rwbColors.length]!
      output = output + getFormattedString(color, letter)
    }
    return output
  }
}
