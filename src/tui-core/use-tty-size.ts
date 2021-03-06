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

import { useStdout } from "ink"
import { EffectCallback, useEffect, useState } from "react"
import { _also } from "../lang-utils/kotlin-lang-utils"
import { StateHook } from "./react-core-utils"

/**
 * https://nodejs.org/api/process.html#processstdout
 * https://nodejs.org/api/tty.html#event-resize
 */
export const useTTYSize = (): TTYSize => {
  // Get the Node.js stdout stream.
  const { stdout } = useStdout()

  // Initial size of the TTY window.
  const [dimensions, setDimensions]: StateHook<TTYSize> = useState(TTYSize.getInstance(stdout))

  // Handle TTY resize events.
  const attachResizeListenerOnMountAndDetachOnUnmountEffectFn: EffectCallback = () => {
    if (!stdout) return
    const _resizeHandler = () => {
      setDimensions(TTYSize.getInstance(stdout))
    }
    const removeEffectFn = () => {
      stdout.off("resize", _resizeHandler)
    }
    stdout.on("resize", _resizeHandler)
    return removeEffectFn
  }
  useEffect(attachResizeListenerOnMountAndDetachOnUnmountEffectFn, [stdout])

  return dimensions
}

export class TTYSize {
  rows = 0
  columns = 0

  static getInstance = (stdout: NodeJS.WriteStream | undefined): TTYSize => {
    if (!stdout) return new TTYSize()
    return _also(new TTYSize(), (it) => {
      it.rows = stdout.rows
      it.columns = stdout.columns
    })
  }

  toString = () => `rows: ${this.rows}, columns: ${this.columns}`
}
