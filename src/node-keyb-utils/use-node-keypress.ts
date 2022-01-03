/*
 * Copyright 2022 R3BL LLC. All rights reserved.
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

import { EffectCallback, useEffect } from "react"
import readline from "readline"
import { TextColor } from "../color-console-utils"
import { ReadlineKey } from "./readline-config"

const DEBUG = false

/**
 * This hook runs onComponentDidMount. If Node.js is running in a terminal (process.stdin.isTTY =
 * true) then it will set Node.js process.stdin to raw mode.
 *
 * More information:
 * https://nodejs.org/api/readline.html#readlineemitkeypresseventsstream-interface
 * https://www.npmjs.com/package/keypress
 * https://nodejs.org/api/readline.html#tty-keybindings
 */
export const useNodeKeypress = (fun: NodeKeypressFn): void => {
  const run: EffectCallback = () => {
    attachToReadlineKeypress(fun)
    return () => {
      detachFromReadlineKeypress(fun)
    }
  }
  useEffect(run, [])
}

/** Note this function signature can't be changed, this is defined by Node.js. */
export type NodeKeypressFn = (input: string, key: ReadlineKey) => void

/**
 * Node.js process.stdin "raw mode" is true means that every single keypress event will be fired as
 * it's typed by the user. false means that one will be fired at the very end after they hit enter.
 * When Node.js detects that it is being run with a text terminal ("TTY") attached `isTTY` will be
 * true.
 *
 * When readline.emitKeypressEvents(process.stdin) is called, Node.js starts emitting "keypress"
 * events on stdin readable stream. In order to stop this, all the listeners must be removed and
 * pause must be called on the stdin stream.
 *
 * More info:
 * https://www.cs.unb.ca/~bremner/teaching/cs2613/books/nodejs-api/tty/
 * https://nodejs.org/api/tty.html#readstreamistty
 *
 * @return {boolean} false means that `fun` was not attached to stdin. true means that it was
 * and raw mode was switched on.
 */
export const attachToReadlineKeypress = (handleKeypressFn: NodeKeypressFn): boolean => {
  if (isTTY()) {
    const { stdin } = process
    readline.emitKeypressEvents(stdin) // Starts process.stdin from emitting "keypress" events.
    stdin.setRawMode(true)
    stdin.setEncoding("utf-8")
    stdin.on("keypress", handleKeypressFn)
    return true
  } else {
    return false
  }
}

export const isTTY = (): boolean => {
  const { stdin } = process
  return stdin?.isTTY
}

export const isTTYinRawMode = (): boolean => {
  const { stdin } = process
  return stdin?.isTTY && stdin?.isRaw
}

export const detachFromReadlineKeypress = (fun?: NodeKeypressFn): void => {
  if (DEBUG) {
    console.log(TextColor.builder.red.bold.build()("before detach"))
    console.log("stdin.isRaw", process.stdin.isRaw)
    console.log("stdin.isTTY", process.stdin.isTTY)
    console.log("isTTY()", isTTY())
    console.log("isTTYinRawMode()", isTTYinRawMode())
  }

  const { stdin } = process
  if (stdin.isTTY) {
    stdin.setRawMode(false)
    fun ? stdin.removeListener("keypress", fun) : stdin.removeAllListeners("keypress")
    stdin.pause() // Stops process.stdin from emitting "keypress" events.
  }

  if (DEBUG) {
    console.log(TextColor.builder.red.underline.bold.build()("after detach"))
    console.log("stdin.isRaw", process.stdin.isRaw)
    console.log("stdin.isTTY", process.stdin.isTTY)
    console.log("isTTY()", isTTY())
    console.log("isTTYinRawMode()", isTTYinRawMode())
  }
}
