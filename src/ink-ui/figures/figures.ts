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

import { fallbackSymbols, mainSymbols } from "./symbols"
import { FigureSet } from "./types"

const shouldUseMain: boolean = isUnicodeSupported()

/** This is the main object that is used by consumers of this library. */
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

