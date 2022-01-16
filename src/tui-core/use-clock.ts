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

import { EffectCallback, useEffect, useState } from "react"
import { _also } from "../kotlin-lang-utils"
import { createTimer } from "../timer-utils"
import { StateHook } from "./react-core-utils"

export const useClock = (): number => {
  const [ time, setTime ]: StateHook<number> = useState<number>(Date.now())
  
  const createTickingTimerToSetTimeEffectFn: EffectCallback = () => {
    const timer = _also(createTimer("useClock", 1000), (it) => {
      it.onTick = () => setTime(Date.now())
      it.startTicking()
    })
    // Clean up this hook.
    return () => {
      timer.stopTicking()
    }
  }
  
  useEffect(createTickingTimerToSetTimeEffectFn, [])
  
  return time
}

/**
 * @param delayMs how often the clock should tick (timer resolution).
 * @return {time formatted to the current locale, raw time in ms}
 */
export const useClockWithLocalTimeFormat = (
  delayMs: number
): { localeTimeString: string; time: number } => {
  const [ time, setTime ]: StateHook<number> = useState<number>(Date.now())
  
  const createTickingTimerToSetTimeEffectFn: EffectCallback = () => {
    const timer = _also(createTimer("useClockWithLocalTimeFormat", delayMs), (it) => {
      it.onTick = () => setTime(Date.now())
      it.startTicking()
    })
    // Clean up this hook.
    return () => {
      timer.stopTicking()
    }
  }
  
  useEffect(createTickingTimerToSetTimeEffectFn, [])
  
  return { localeTimeString: new Date(time).toLocaleTimeString(), time }
}
