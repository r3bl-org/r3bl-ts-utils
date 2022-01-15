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

import { useStdin } from "ink"
import { EffectCallback, useEffect } from "react"
import { _also } from "../kotlin-lang-utils"
import { createTimer } from "../timer-utils"

/**
 * If terminal is not in raw mode create a recurring task so that Node.js process won't exit.
 * - https://nodejs.org/api/tty.html#readstreamisraw
 */
export const usePreventProcessExitDuringTesting = (delayMs = 1_000): void => {
  const { isRawModeSupported: inRawMode } = useStdin()
  
  if (inRawMode) return
  
  const createTickingTimerEffectFn: EffectCallback = () => {
    // Start a timer that doesn't have a tickFn (just puts an event in Node.js event queue).
    const timer = _also(createTimer("usePreventProcessExitDuringTesting", delayMs), (it) => {
      it.startTicking()
    })
    // Clean up this hook.
    return () => {
      timer.stopTicking()
    }
  }
  useEffect(createTickingTimerEffectFn, [])
}