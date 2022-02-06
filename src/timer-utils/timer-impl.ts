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

import { _also } from "../lang-utils/kotlin-lang-utils"
import {
  Optional
} from "../lang-utils/core"
import {OptionValue, Option} from "../lang-utils/rust-lang-utils"
import { _callIfTruthy } from "../lang-utils/expression-lang-utils"
import { _callIfSome } from "../lang-utils/rust-lang-utils"
import { Counter } from "./counter"
import { State, TimerTickFn } from "./externals"
import { TimerInternal } from "./internals"
import { Actions, reducerFn } from "./timer-reducer"

// Constants.
const DEBUG = false
export const NoDuration = -1

export class TimerImpl implements TimerInternal {
  // Properties (simple).

  /**
   * Node.js uses Timeout and browser uses number. ReturnType<typeof setTimeout> handles this 🎉.
   *
   * More info:
   * - https://tinyurl.com/y2bssbfr
   * - https://stackoverflow.com/a/56970244/2085356
   * @private
   */
  private timerHandle?: ReturnType<typeof setTimeout>

  // Properties (backing fields for getters, setters).

  private _state: State
  private _onTickFn: Option<TimerTickFn> = OptionValue.createNone()
  private _onStopFn: Option<TimerTickFn> = OptionValue.createNone()
  private _onStartFn: Option<TimerTickFn> = OptionValue.createNone()

  constructor(
    readonly name: string,
    readonly delayMs: number,
    readonly durationMs: number = NoDuration,
    readonly counter?: Counter
  ) {
    this._state = this.dispatch() // Initialize the state.
  }

  // Getter and setter for onStop.
  getOnStopFn(): Option<TimerTickFn> {
    return this._onStopFn
  }
  setOnStopFn(fn: Optional<TimerTickFn>) {
    this._onStopFn = OptionValue.create(fn)
  }

  // Getter and setter for onStart.
  getOnStartFn(): Option<TimerTickFn> {
    return this._onStartFn
  }
  setOnStartFn(value: Optional<TimerTickFn>) {
    this._onStartFn = OptionValue.create(value)
  }

  // Getter and setter for onTick.
  getOnTickFn(): Option<TimerTickFn> {
    return this._onTickFn
  }
  setOnTickFn(fn: Optional<TimerTickFn>) {
    this._onTickFn = OptionValue.create(fn)
  }

  // State management delegated to TimerReducer.

  /**
   * Computes the new state using `TimerReducer.reducerFn` and puts it `this.state` property.
   * @param action if not provided compute initial state, else use it to get new state
   * @return new state object
   */
  private dispatch = (action?: Actions): State =>
    _also(reducerFn(this, this.state, action), (newState) => {
      this._state = newState
    })

  startTicking = (): this => {
    this.dispatch({ type: "start", startTime: Date.now() })
    return this
  }

  stopTicking = (): this => {
    this.dispatch({ type: "stop", stopTime: Date.now() })
    return this
  }

  // Getters for state.

  get isStopped(): boolean {
    return this.state.runtimeStatus === "stopped"
  }

  get isRunning(): boolean {
    return this.state.runtimeStatus === "running"
  }

  get isCreatedAndNotStarted(): boolean {
    return this.state.runtimeStatus === "created_not_started"
  }

  get state(): State {
    return this._state
  }

  // Logic to start / stop the timer.

  actuallyStart = () => {
    const { name, durationMs, state, counter, delayMs } = this

    DEBUG && console.log(name ?? "Timer", "start called, timerHandle = ", this.timerHandle)

    const doTickAndAutoStopCheck = () => {
      if (durationMs > 0 && Date.now() - state.startTime >= durationMs) {
        this.stopTicking()
      } else {
        _callIfSome(this._onTickFn, fn => fn(this))
        counter?.increment()
      }
    }

    this.timerHandle = setInterval(doTickAndAutoStopCheck, delayMs)

    _callIfSome(this._onStartFn, fn => fn(this))

    DEBUG && console.log(name ?? "Timer", "started, timerHandle = ", this.timerHandle)
  }

  actuallyStop = () => {
    const { name } = this
    DEBUG && console.log(name ?? "Timer", "stop called, timerHandle = ", this.timerHandle)

    if (this.timerHandle) {
      // eslint-disable-next-line
      clearInterval(this.timerHandle) // Node.js uses Timeout and browser uses number.
      this.timerHandle = undefined
    }

    _callIfSome(this._onStopFn, fn => fn(this))

    DEBUG && console.log(name ?? "Timer", "stopped, timerHandle = ", this.timerHandle)
  }

  // Misc methods.

  toString = (): string => {
    const { counter, delayMs, name, state, durationMs } = this
    return `name: '${name}', delay: ${delayMs}ms, ${durationMs !== NoDuration ? `duration:${durationMs}ms` : ""
      } counter:${counter ? counter.value : "n/a"}, state:${state.runtimeStatus}`
  }
}
