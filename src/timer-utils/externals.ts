/*
 * These types and interfaces are exported to the users of this API. They form the public facing
 * interface of timer-utils.
 */

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

import { Optional } from "../lang-utils/core"
import { Option } from "../lang-utils/rust-lang-utils"
import { Counter } from "./counter"

export interface State {
  runtimeStatus: LifecycleStage
  startTime: number
  stopTime: number
}

export type TimerTickFn = (timer: Timer) => void

type LifecycleStage = "created_not_started" | "running" | "stopped"

export interface Timer {
  readonly name: string
  readonly delayMs: number
  readonly durationMs: number
  readonly isStopped: boolean
  readonly isRunning: boolean
  readonly isCreatedAndNotStarted: boolean
  readonly state: State
  counter?: Counter

  // onStopFn getter and setter.
  getOnStopFn: () => Option<TimerTickFn>
  setOnStopFn: (fn: Optional<TimerTickFn>) => void

  // onStartFn getter and setter.
  getOnStartFn: () => Option<TimerTickFn>
  setOnStartFn: (fn: Optional<TimerTickFn>) => void

  // onTickFn getter and setter.
  getOnTickFn: () => Option<TimerTickFn>
  setOnTickFn: (fn: Optional<TimerTickFn>) => void

  // Timer control.
  startTicking: () => this
  stopTicking: () => this

  // Debug.
  toString: () => string
}

export const TimerErrors = {
  CantStart_AlreadyRunning: new Error("Timer can't be started, its already running"),
  CantStop_NotStarted: new Error("Timer can't be stopped, as it's created but not started"),
  CantStart_AlreadyStopped: new Error("Stopped timer can't be started, please make a new one"),
  CantStop_AlreadyStopped: new Error("Stopped timer can't be stopped, please make a new one"),
}
