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

import { Key, useStdout } from "ink"
import { _also, StateHook } from "../index"
import { useEffect, useState } from "react"
import * as readline from "readline"

//#region TTYSize.
/**
 * https://nodejs.org/api/process.html#processstdout
 * https://nodejs.org/api/tty.html#event-resize
 */
export function useTTYSize(): TTYSize {
  // Get the Node.js stdout stream.
  const { stdout } = useStdout()

  // Initial size of the TTY window.
  const [dimensions, setDimensions]: StateHook<TTYSize> = useState(TTYSize.getInstance(stdout))

  // Handle TTY resize events.
  useEffect(() => {
    if (!stdout) return
    const _resizeHandler = () => {
      setDimensions(TTYSize.getInstance(stdout))
    }
    const removeEffectFn = () => {
      stdout.off("resize", _resizeHandler)
    }
    stdout.on("resize", _resizeHandler)
    return removeEffectFn
  }, [stdout])

  return dimensions
}

export class TTYSize {
  rows = 0
  columns = 0

  static getInstance(stdout: NodeJS.WriteStream | undefined): TTYSize {
    if (!stdout) return new TTYSize()
    return _also(new TTYSize(), (it) => {
      it.rows = stdout.rows
      it.columns = stdout.columns
    })
  }

  toString() {
    return `rows: ${this.rows}, columns: ${this.columns}`
  }
}
//#endregion

//#region Keyboard handling.
export type KeyboardInputHandlerFn = (input: string, key: Key) => void

export type KeyPressed = string | Key | undefined

// https://developerlife.com/2021/07/02/nodejs-typescript-handbook/#user-defined-type-guards
export function isKeyType(param: any): param is Key {
  const key = param as Key
  return (
    key.upArrow !== undefined &&
    key.downArrow !== undefined &&
    key.leftArrow !== undefined &&
    key.rightArrow !== undefined &&
    key.pageDown !== undefined &&
    key.pageUp !== undefined &&
    key.return !== undefined &&
    key.escape !== undefined &&
    key.ctrl !== undefined &&
    key.shift !== undefined &&
    key.tab !== undefined &&
    key.backspace !== undefined &&
    key.delete !== undefined &&
    key.meta !== undefined
  )
}

export function keyPressedToString(keyPressed: KeyPressed): string {
  if (!keyPressed) return "n/a"

  // https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
  type OptionsFlags<T> = {
    [Property in keyof T as string]: boolean
  }

  if (isKeyType(keyPressed)) {
    const opts: OptionsFlags<Key> = {
      backspace: keyPressed.backspace,
      ctrl: keyPressed.ctrl,
      delete: keyPressed.delete,
      downArrow: keyPressed.downArrow,
      escape: keyPressed.escape,
      leftArrow: keyPressed.leftArrow,
      meta: keyPressed.meta,
      pageDown: keyPressed.pageDown,
      pageUp: keyPressed.pageUp,
      return: keyPressed.return,
      rightArrow: keyPressed.rightArrow,
      shift: keyPressed.shift,
      tab: keyPressed.tab,
      upArrow: keyPressed.upArrow,
    }
    for (const key in opts) {
      if (opts[key]) return key
    }
  }

  if (typeof keyPressed === "string") {
    return keyPressed
  }

  return "n/a"
}

//#endregion

//#region Node.js keypress event handling.

/**
 * https://nodejs.org/api/readline.html#readlineemitkeypresseventsstream-interface
 * https://www.npmjs.com/package/keypress
 */
export function useKeypress() {
  useEffect(fun, [])
  function fun() {
    readline.emitKeypressEvents(process.stdin)
    if (process.stdin.isTTY) process.stdin.setRawMode(true)
    process.stdin.on("keypress", (chunk, key) => {
      console.log("chunk", chunk)
      console.log("key", key)
      // Example of detecting a keypress:
      // if (key && key.ctrl && key.name == 'c') process.exit();
    })
  }
}

//#endregion
