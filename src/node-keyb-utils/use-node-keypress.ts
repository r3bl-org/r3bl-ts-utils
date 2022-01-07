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

import { EffectCallback, useEffect } from "react"
import readline from "readline"
import { TextColor } from "../color-console-utils"
import { _callIfTrue, _callIfTrueWithReturn } from "../misc-utils"
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
export const useNodeKeypress = (
  fun: HandleNodeKeypressFn,
  options: IsActive = { isActive: true }
): void => {
  _callIfTrue(DEBUG, () => {
    const formatter = options.isActive
      ? TextColor.builder.bgGreen.black.build()
      : TextColor.builder.bgRed.black.build()
    console.log(formatter("useNodeKeypress - run hook, isActive="), options.isActive)
  })

  const manageListenerForKeypressEffectFn: EffectCallback = () => {
    DEBUG &&
      console.log(
        TextColor.builder.bgYellow.gray.build()(
          "useNodeKeypress -> manageListenerForKeypressEffectFn"
        )
      )

    const isAttached = _callIfTrueWithReturn(
      options.isActive,
      () => {
        DEBUG &&
          console.log(
            TextColor.builder.bgYellow.gray.build()(
              "isActive:true -> call attachToReadlineKeypress"
            )
          )
        return attachToReadlineKeypress(fun)
      },
      () => {
        DEBUG && console.log(TextColor.builder.bgYellow.gray.build()("isActive:false -> noop"))
        return false
      }
    )

    return _callIfTrueWithReturn<ReturnType<EffectCallback>>(
      isAttached,
      () => {
        return () => {
          detachFromReadlineKeypress(fun)
          DEBUG &&
            console.log(TextColor.builder.bgYellow.gray.build()("useNodeKeypress - effect cleanup"))
        }
      },
      () => {
        return undefined
      }
    )
  }

  useEffect(manageListenerForKeypressEffectFn, [options.isActive])
}

/** Note this function signature can't be changed, this is defined by Node.js. */
export type HandleNodeKeypressFn = (input: string, key: ReadlineKey) => void

export type IsActive = { isActive: boolean }

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
export const attachToReadlineKeypress = (handleKeypressFn: HandleNodeKeypressFn): boolean => {
  DEBUG && logTTYState("before attach")

  if (isTTY()) {
    const { stdin } = process

    // Starts process.stdin from emitting "keypress" events.
    readline.emitKeypressEvents(stdin)

    stdin.setRawMode(true)
    stdin.setEncoding("utf-8")
    stdin.on("keypress", handleKeypressFn)

    DEBUG && logTTYState("after attach")
    return true
  } else {
    DEBUG && logTTYState("didn't attach", true)
    return false
  }
}

export const detachFromReadlineKeypress = (fun: HandleNodeKeypressFn): void => {
  DEBUG && logTTYState("before detach")

  const { stdin } = process

  stdin.removeListener("keypress", fun)
  DEBUG && logTTYState("1. remove keypress listener", true)

  if (stdin.listenerCount("keypress") === 0) {
    DEBUG && logTTYState("2. pause stdin", true)
    stdin.pause() // Stops process.stdin from emitting "keypress" events.
  }

  DEBUG && logTTYState("after detach")
}

export function logTTYState(msg: string, em = false) {
  console.log(
    em
      ? TextColor.builder.bgWhite.red.bold.build()(msg)
      : TextColor.builder.red.underline.bold.build()(msg)
  )
  // console.log("stdin.isRaw", process.stdin.isRaw)
  // console.log("stdin.isTTY", process.stdin.isTTY)
  console.log("isTTY()", isTTY())
  console.log("isTTYinRawMode()", isTTYinRawMode())
}

export const isTTY = () => process?.stdin?.isTTY
export const isTTYinRawMode = () => process?.stdin?.isTTY && process?.stdin?.isRaw
