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

const { platform } = process

const common = {
  square: "█",
  squareDarkShade: "▓",
  squareMediumShade: "▒",
  squareLightShade: "░",
  squareTop: "▀",
  squareBottom: "▄",
  squareLeft: "▌",
  squareRight: "▐",
  squareCenter: "■",
  bullet: "●",
  dot: "․",
  ellipsis: "…",
  pointerSmall: "›",
  triangleUp: "▲",
  triangleUpSmall: "▴",
  triangleDown: "▼",
  triangleDownSmall: "▾",
  triangleLeftSmall: "◂",
  triangleRightSmall: "▸",
  home: "⌂",
  heart: "♥",
  musicNote: "♪",
  musicNoteBeamed: "♫",
  arrowUp: "↑",
  arrowDown: "↓",
  arrowLeft: "←",
  arrowRight: "→",
  arrowLeftRight: "↔",
  arrowUpDown: "↕",
  almostEqual: "≈",
  notEqual: "≠",
  lessOrEqual: "≤",
  greaterOrEqual: "≥",
  identical: "≡",
  infinity: "∞",
  subscriptZero: "₀",
  subscriptOne: "₁",
  subscriptTwo: "₂",
  subscriptThree: "₃",
  subscriptFour: "₄",
  subscriptFive: "₅",
  subscriptSix: "₆",
  subscriptSeven: "₇",
  subscriptEight: "₈",
  subscriptNine: "₉",
  oneHalf: "½",
  oneThird: "⅓",
  oneQuarter: "¼",
  oneFifth: "⅕",
  oneSixth: "⅙",
  oneEighth: "⅛",
  twoThirds: "⅔",
  twoFifths: "⅖",
  threeQuarters: "¾",
  threeFifths: "⅗",
  threeEighths: "⅜",
  fourFifths: "⅘",
  fiveSixths: "⅚",
  fiveEighths: "⅝",
  sevenEighths: "⅞",
  line: "─",
  lineBold: "━",
  lineDouble: "═",
  lineDashed0: "┄",
  lineDashed1: "┅",
  lineDashed2: "┈",
  lineDashed3: "┉",
  lineDashed4: "╌",
  lineDashed5: "╍",
  lineDashed6: "╴",
  lineDashed7: "╶",
  lineDashed8: "╸",
  lineDashed9: "╺",
  lineDashed10: "╼",
  lineDashed11: "╾",
  lineDashed12: "−",
  lineDashed13: "–",
  lineDashed14: "‐",
  lineDashed15: "⁃",
  lineVertical: "│",
  lineVerticalBold: "┃",
  lineVerticalDouble: "║",
  lineVerticalDashed0: "┆",
  lineVerticalDashed1: "┇",
  lineVerticalDashed2: "┊",
  lineVerticalDashed3: "┋",
  lineVerticalDashed4: "╎",
  lineVerticalDashed5: "╏",
  lineVerticalDashed6: "╵",
  lineVerticalDashed7: "╷",
  lineVerticalDashed8: "╹",
  lineVerticalDashed9: "╻",
  lineVerticalDashed10: "╽",
  lineVerticalDashed11: "╿",
  lineDownLeft: "┐",
  lineDownLeftArc: "╮",
  lineDownBoldLeftBold: "┓",
  lineDownBoldLeft: "┒",
  lineDownLeftBold: "┑",
  lineDownDoubleLeftDouble: "╗",
  lineDownDoubleLeft: "╖",
  lineDownLeftDouble: "╕",
  lineDownRight: "┌",
  lineDownRightArc: "╭",
  lineDownBoldRightBold: "┏",
  lineDownBoldRight: "┎",
  lineDownRightBold: "┍",
  lineDownDoubleRightDouble: "╔",
  lineDownDoubleRight: "╓",
  lineDownRightDouble: "╒",
  lineUpLeft: "┘",
  lineUpLeftArc: "╯",
  lineUpBoldLeftBold: "┛",
  lineUpBoldLeft: "┚",
  lineUpLeftBold: "┙",
  lineUpDoubleLeftDouble: "╝",
  lineUpDoubleLeft: "╜",
  lineUpLeftDouble: "╛",
  lineUpRight: "└",
  lineUpRightArc: "╰",
  lineUpBoldRightBold: "┗",
  lineUpBoldRight: "┖",
  lineUpRightBold: "┕",
  lineUpDoubleRightDouble: "╚",
  lineUpDoubleRight: "╙",
  lineUpRightDouble: "╘",
  lineUpDownLeft: "┤",
  lineUpBoldDownBoldLeftBold: "┫",
  lineUpBoldDownBoldLeft: "┨",
  lineUpDownLeftBold: "┥",
  lineUpBoldDownLeftBold: "┩",
  lineUpDownBoldLeftBold: "┪",
  lineUpDownBoldLeft: "┧",
  lineUpBoldDownLeft: "┦",
  lineUpDoubleDownDoubleLeftDouble: "╣",
  lineUpDoubleDownDoubleLeft: "╢",
  lineUpDownLeftDouble: "╡",
  lineUpDownRight: "├",
  lineUpBoldDownBoldRightBold: "┣",
  lineUpBoldDownBoldRight: "┠",
  lineUpDownRightBold: "┝",
  lineUpBoldDownRightBold: "┡",
  lineUpDownBoldRightBold: "┢",
  lineUpDownBoldRight: "┟",
  lineUpBoldDownRight: "┞",
  lineUpDoubleDownDoubleRightDouble: "╠",
  lineUpDoubleDownDoubleRight: "╟",
  lineUpDownRightDouble: "╞",
  lineDownLeftRight: "┬",
  lineDownBoldLeftBoldRightBold: "┳",
  lineDownLeftBoldRightBold: "┯",
  lineDownBoldLeftRight: "┰",
  lineDownBoldLeftBoldRight: "┱",
  lineDownBoldLeftRightBold: "┲",
  lineDownLeftRightBold: "┮",
  lineDownLeftBoldRight: "┭",
  lineDownDoubleLeftDoubleRightDouble: "╦",
  lineDownDoubleLeftRight: "╥",
  lineDownLeftDoubleRightDouble: "╤",
  lineUpLeftRight: "┴",
  lineUpBoldLeftBoldRightBold: "┻",
  lineUpLeftBoldRightBold: "┷",
  lineUpBoldLeftRight: "┸",
  lineUpBoldLeftBoldRight: "┹",
  lineUpBoldLeftRightBold: "┺",
  lineUpLeftRightBold: "┶",
  lineUpLeftBoldRight: "┵",
  lineUpDoubleLeftDoubleRightDouble: "╩",
  lineUpDoubleLeftRight: "╨",
  lineUpLeftDoubleRightDouble: "╧",
  lineUpDownLeftRight: "┼",
  lineUpBoldDownBoldLeftBoldRightBold: "╋",
  lineUpDownBoldLeftBoldRightBold: "╈",
  lineUpBoldDownLeftBoldRightBold: "╇",
  lineUpBoldDownBoldLeftRightBold: "╊",
  lineUpBoldDownBoldLeftBoldRight: "╉",
  lineUpBoldDownLeftRight: "╀",
  lineUpDownBoldLeftRight: "╁",
  lineUpDownLeftBoldRight: "┽",
  lineUpDownLeftRightBold: "┾",
  lineUpBoldDownBoldLeftRight: "╂",
  lineUpDownLeftBoldRightBold: "┿",
  lineUpBoldDownLeftBoldRight: "╃",
  lineUpBoldDownLeftRightBold: "╄",
  lineUpDownBoldLeftBoldRight: "╅",
  lineUpDownBoldLeftRightBold: "╆",
  lineUpDoubleDownDoubleLeftDoubleRightDouble: "╬",
  lineUpDoubleDownDoubleLeftRight: "╫",
  lineUpDownLeftDoubleRightDouble: "╪",
  lineCross: "╳",
  lineBackslash: "╲",
  lineSlash: "╱"
}

/** Symbols to use when the terminal supports Unicode symbols. */
export const mainSymbols: FigureSet = {
  ...common,
  // The main symbols for those do not look that good on Ubuntu.
  ...(
    platform === "linux" ?
      {
        circleQuestionMark: "?⃝",
        questionMarkPrefix: "?⃝"
      } :
      {
        circleQuestionMark: "?",
        questionMarkPrefix: "?"
      }
  ),
  tick: "✔",
  info: "ℹ",
  warning: "⚠",
  cross: "✖",
  squareSmall: "◻",
  squareSmallFilled: "◼",
  circle: "◯",
  circleFilled: "◉",
  circleDotted: "◌",
  circleDouble: "◎",
  circleCircle: "ⓞ",
  circleCross: "ⓧ",
  circlePipe: "Ⓘ",
  radioOn: "◉",
  radioOff: "◯",
  checkboxOn: "☒",
  checkboxOff: "☐",
  checkboxCircleOn: "ⓧ",
  checkboxCircleOff: "Ⓘ",
  pointer: "❯",
  triangleUpOutline: "△",
  triangleLeft: "◀",
  triangleRight: "▶",
  lozenge: "◆",
  lozengeOutline: "◇",
  hamburger: "☰",
  smiley: "㋡",
  mustache: "෴",
  star: "★",
  play: "▶",
  nodejs: "⬢",
  oneSeventh: "⅐",
  oneNinth: "⅑",
  oneTenth: "⅒"
}

export const fallbackSymbols = {
  ...common,
  tick: "√",
  info: "i",
  warning: "‼",
  cross: "×",
  squareSmall: "□",
  squareSmallFilled: "■",
  circle: "( )",
  circleFilled: "(*)",
  circleDotted: "( )",
  circleDouble: "( )",
  circleCircle: "(○)",
  circleCross: "(×)",
  circlePipe: "(│)",
  circleQuestionMark: "(?)",
  radioOn: "(*)",
  radioOff: "( )",
  checkboxOn: "[×]",
  checkboxOff: "[ ]",
  checkboxCircleOn: "(×)",
  checkboxCircleOff: "( )",
  questionMarkPrefix: "？",
  pointer: ">",
  triangleUpOutline: "∆",
  triangleLeft: "◄",
  triangleRight: "►",
  lozenge: "♦",
  lozengeOutline: "◊",
  hamburger: "≡",
  smiley: "☺",
  mustache: "┌─┐",
  star: "✶",
  play: "►",
  nodejs: "♦",
  oneSeventh: "1/7",
  oneNinth: "1/9",
  oneTenth: "1/10"
}

const shouldUseMain: boolean = isUnicodeSupported()

export const figures: FigureSet = shouldUseMain ? mainSymbols : fallbackSymbols

const isFallbackSymbol = (key: keyof FigureSet, mainSymbol: string): boolean =>
  fallbackSymbols[key] !== mainSymbol

const getFigureRegExp = (key: keyof FigureSet, mainSymbol: string): [ RegExp, string ] => [
  new RegExp(escapeStringRegexp(mainSymbol), "g"), fallbackSymbols[key]
]

let replacements: [ RegExp, string ][] = []
const getReplacements = () => {
  if (replacements.length > 0) {
    return replacements
  }
  
  replacements = Object.entries(mainSymbols)
    .filter(([ key, mainSymbol ]) => isFallbackSymbol(key as keyof FigureSet, mainSymbol as string))
    .map(([ key, mainSymbol ]) => getFigureRegExp(key as keyof FigureSet, mainSymbol as string))
  return replacements
}

/**
 On terminals which do not support Unicode symbols, substitute them to other symbols.
 Replace Unicode symbols depending on the terminal.
 
 @param string - String where the Unicode symbols will be replaced with fallback symbols depending
 on the terminal.
 @returns The input with replaced fallback Unicode symbols.
 @example
 ```
 import figures, {replaceSymbols} from 'figures';
 console.log(replaceSymbols('✔︎ check'));
 // On terminals with Unicode symbols:  ✔︎ check
 // On other terminals:                 √ check
 console.log(figures.tick);
 // On terminals with Unicode symbols:  ✔︎
 // On other terminals:                 √
 ```
 */
export function replaceSymbols(arg: string): string {
  if (shouldUseMain) return arg
  
  for (const [ figureRegExp, fallbackSymbol ] of getReplacements()) {
    arg = arg.replace(figureRegExp, fallbackSymbol)
  }
  return arg
}

/** Symbols to use on any terminal. */
export interface FigureSet {
  readonly tick: string;
  readonly info: string;
  readonly warning: string;
  readonly cross: string;
  readonly square: string;
  readonly squareSmall: string;
  readonly squareSmallFilled: string;
  readonly squareDarkShade: string;
  readonly squareMediumShade: string;
  readonly squareLightShade: string;
  readonly squareTop: string;
  readonly squareBottom: string;
  readonly squareLeft: string;
  readonly squareRight: string;
  readonly squareCenter: string;
  readonly circle: string;
  readonly circleFilled: string;
  readonly circleDotted: string;
  readonly circleDouble: string;
  readonly circleCircle: string;
  readonly circleCross: string;
  readonly circlePipe: string;
  readonly circleQuestionMark: string;
  readonly radioOn: string;
  readonly radioOff: string;
  readonly checkboxOn: string;
  readonly checkboxOff: string;
  readonly checkboxCircleOn: string;
  readonly checkboxCircleOff: string;
  readonly questionMarkPrefix: string;
  readonly bullet: string;
  readonly dot: string;
  readonly ellipsis: string;
  readonly pointer: string;
  readonly pointerSmall: string;
  readonly triangleUp: string;
  readonly triangleUpSmall: string;
  readonly triangleUpOutline: string;
  readonly triangleDown: string;
  readonly triangleDownSmall: string;
  readonly triangleLeft: string;
  readonly triangleLeftSmall: string;
  readonly triangleRight: string;
  readonly triangleRightSmall: string;
  readonly lozenge: string;
  readonly lozengeOutline: string;
  readonly home: string;
  readonly hamburger: string;
  readonly smiley: string;
  readonly mustache: string;
  readonly heart: string;
  readonly star: string;
  readonly play: string;
  readonly musicNote: string;
  readonly musicNoteBeamed: string;
  readonly nodejs: string;
  readonly arrowUp: string;
  readonly arrowDown: string;
  readonly arrowLeft: string;
  readonly arrowRight: string;
  readonly arrowLeftRight: string;
  readonly arrowUpDown: string;
  readonly almostEqual: string;
  readonly notEqual: string;
  readonly lessOrEqual: string;
  readonly greaterOrEqual: string;
  readonly identical: string;
  readonly infinity: string;
  readonly subscriptZero: string;
  readonly subscriptOne: string;
  readonly subscriptTwo: string;
  readonly subscriptThree: string;
  readonly subscriptFour: string;
  readonly subscriptFive: string;
  readonly subscriptSix: string;
  readonly subscriptSeven: string;
  readonly subscriptEight: string;
  readonly subscriptNine: string;
  readonly oneHalf: string;
  readonly oneThird: string;
  readonly oneQuarter: string;
  readonly oneFifth: string;
  readonly oneSixth: string;
  readonly oneSeventh: string;
  readonly oneEighth: string;
  readonly oneNinth: string;
  readonly oneTenth: string;
  readonly twoThirds: string;
  readonly twoFifths: string;
  readonly threeQuarters: string;
  readonly threeFifths: string;
  readonly threeEighths: string;
  readonly fourFifths: string;
  readonly fiveSixths: string;
  readonly fiveEighths: string;
  readonly sevenEighths: string;
  readonly line: string;
  readonly lineBold: string;
  readonly lineDouble: string;
  readonly lineDashed0: string;
  readonly lineDashed1: string;
  readonly lineDashed2: string;
  readonly lineDashed3: string;
  readonly lineDashed4: string;
  readonly lineDashed5: string;
  readonly lineDashed6: string;
  readonly lineDashed7: string;
  readonly lineDashed8: string;
  readonly lineDashed9: string;
  readonly lineDashed10: string;
  readonly lineDashed11: string;
  readonly lineDashed12: string;
  readonly lineDashed13: string;
  readonly lineDashed14: string;
  readonly lineDashed15: string;
  readonly lineVertical: string;
  readonly lineVerticalBold: string;
  readonly lineVerticalDouble: string;
  readonly lineVerticalDashed0: string;
  readonly lineVerticalDashed1: string;
  readonly lineVerticalDashed2: string;
  readonly lineVerticalDashed3: string;
  readonly lineVerticalDashed4: string;
  readonly lineVerticalDashed5: string;
  readonly lineVerticalDashed6: string;
  readonly lineVerticalDashed7: string;
  readonly lineVerticalDashed8: string;
  readonly lineVerticalDashed9: string;
  readonly lineVerticalDashed10: string;
  readonly lineVerticalDashed11: string;
  readonly lineDownLeft: string;
  readonly lineDownLeftArc: string;
  readonly lineDownBoldLeftBold: string;
  readonly lineDownBoldLeft: string;
  readonly lineDownLeftBold: string;
  readonly lineDownDoubleLeftDouble: string;
  readonly lineDownDoubleLeft: string;
  readonly lineDownLeftDouble: string;
  readonly lineDownRight: string;
  readonly lineDownRightArc: string;
  readonly lineDownBoldRightBold: string;
  readonly lineDownBoldRight: string;
  readonly lineDownRightBold: string;
  readonly lineDownDoubleRightDouble: string;
  readonly lineDownDoubleRight: string;
  readonly lineDownRightDouble: string;
  readonly lineUpLeft: string;
  readonly lineUpLeftArc: string;
  readonly lineUpBoldLeftBold: string;
  readonly lineUpBoldLeft: string;
  readonly lineUpLeftBold: string;
  readonly lineUpDoubleLeftDouble: string;
  readonly lineUpDoubleLeft: string;
  readonly lineUpLeftDouble: string;
  readonly lineUpRight: string;
  readonly lineUpRightArc: string;
  readonly lineUpBoldRightBold: string;
  readonly lineUpBoldRight: string;
  readonly lineUpRightBold: string;
  readonly lineUpDoubleRightDouble: string;
  readonly lineUpDoubleRight: string;
  readonly lineUpRightDouble: string;
  readonly lineUpDownLeft: string;
  readonly lineUpBoldDownBoldLeftBold: string;
  readonly lineUpBoldDownBoldLeft: string;
  readonly lineUpDownLeftBold: string;
  readonly lineUpBoldDownLeftBold: string;
  readonly lineUpDownBoldLeftBold: string;
  readonly lineUpDownBoldLeft: string;
  readonly lineUpBoldDownLeft: string;
  readonly lineUpDoubleDownDoubleLeftDouble: string;
  readonly lineUpDoubleDownDoubleLeft: string;
  readonly lineUpDownLeftDouble: string;
  readonly lineUpDownRight: string;
  readonly lineUpBoldDownBoldRightBold: string;
  readonly lineUpBoldDownBoldRight: string;
  readonly lineUpDownRightBold: string;
  readonly lineUpBoldDownRightBold: string;
  readonly lineUpDownBoldRightBold: string;
  readonly lineUpDownBoldRight: string;
  readonly lineUpBoldDownRight: string;
  readonly lineUpDoubleDownDoubleRightDouble: string;
  readonly lineUpDoubleDownDoubleRight: string;
  readonly lineUpDownRightDouble: string;
  readonly lineDownLeftRight: string;
  readonly lineDownBoldLeftBoldRightBold: string;
  readonly lineDownLeftBoldRightBold: string;
  readonly lineDownBoldLeftRight: string;
  readonly lineDownBoldLeftBoldRight: string;
  readonly lineDownBoldLeftRightBold: string;
  readonly lineDownLeftRightBold: string;
  readonly lineDownLeftBoldRight: string;
  readonly lineDownDoubleLeftDoubleRightDouble: string;
  readonly lineDownDoubleLeftRight: string;
  readonly lineDownLeftDoubleRightDouble: string;
  readonly lineUpLeftRight: string;
  readonly lineUpBoldLeftBoldRightBold: string;
  readonly lineUpLeftBoldRightBold: string;
  readonly lineUpBoldLeftRight: string;
  readonly lineUpBoldLeftBoldRight: string;
  readonly lineUpBoldLeftRightBold: string;
  readonly lineUpLeftRightBold: string;
  readonly lineUpLeftBoldRight: string;
  readonly lineUpDoubleLeftDoubleRightDouble: string;
  readonly lineUpDoubleLeftRight: string;
  readonly lineUpLeftDoubleRightDouble: string;
  readonly lineUpDownLeftRight: string;
  readonly lineUpBoldDownBoldLeftBoldRightBold: string;
  readonly lineUpDownBoldLeftBoldRightBold: string;
  readonly lineUpBoldDownLeftBoldRightBold: string;
  readonly lineUpBoldDownBoldLeftRightBold: string;
  readonly lineUpBoldDownBoldLeftBoldRight: string;
  readonly lineUpBoldDownLeftRight: string;
  readonly lineUpDownBoldLeftRight: string;
  readonly lineUpDownLeftBoldRight: string;
  readonly lineUpDownLeftRightBold: string;
  readonly lineUpBoldDownBoldLeftRight: string;
  readonly lineUpDownLeftBoldRightBold: string;
  readonly lineUpBoldDownLeftBoldRight: string;
  readonly lineUpBoldDownLeftRightBold: string;
  readonly lineUpDownBoldLeftBoldRight: string;
  readonly lineUpDownBoldLeftRightBold: string;
  readonly lineUpDoubleDownDoubleLeftDoubleRightDouble: string;
  readonly lineUpDoubleDownDoubleLeftRight: string;
  readonly lineUpDownLeftDoubleRightDouble: string;
  readonly lineCross: string;
  readonly lineBackslash: string;
  readonly lineSlash: string;
}

function isUnicodeSupported(): boolean {
  if (process.platform !== "win32") {
    return process.env["TERM"] !== "linux" // Linux console (kernel)
  }
  
  return Boolean(process.env["CI"]) ||
         Boolean(process.env["WT_SESSION"]) || // Windows Terminal
         process.env["ConEmuTask"] === "{cmd::Cmder}" || // ConEmu and cmder
         process.env["TERM_PROGRAM"] === "vscode" ||
         process.env["TERM"] === "xterm-256color" ||
         process.env["TERM"] === "alacritty"
}

function escapeStringRegexp(arg: string): string {
  if (typeof arg !== "string") {
    throw new TypeError("Expected a string")
  }
  
  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler
  // form would be disallowed by Unicode patterns’ stricter grammar.
  return arg
    .replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
    .replace(/-/g, "\\x2d")
}

