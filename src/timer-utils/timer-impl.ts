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

import { State, TimerTickFn } from "./externals"
import { Actions, reducerFn } from "./timer-reducer"
import { Counter } from "./counter"
import { _also } from "../kotlin-lang-utils"
import { _callIfTruthy, Nullable } from "../misc-utils"
import { TimerInternal } from "./internals"

// Constants.
const DEBUG = false
const NoDuration = -1

export class TimerImpl implements TimerInternal {
  // Properties (simple).

  private timerHandle?: NodeJS.Timeout

  // Properties (backing fields for getters, setters).

  private _state: State
  private _tickFn?: TimerTickFn
  private _stopFn?: TimerTickFn
  private _startFn?: TimerTickFn
  private _counter: Counter = new Counter()

  constructor(
    readonly name: string,
    readonly delayMs: number,
    readonly durationMs: number = NoDuration
  ) {
    this._state = this.dispatch()
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

  startTicking(): this {
    this.dispatch({ type: "start", startTime: Date.now() })
    return this
  }

  stopTicking(): this {
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

  actuallyStart() {
    const { name, durationMs, state, counter, delayMs } = this

    DEBUG && console.log(name ?? "Timer", "start called, timerHandle = ", this.timerHandle)

    const doTickAndAutoStopCheck = () => {
      if (durationMs > 0 && Date.now() - state.startTime >= durationMs) {
        this.stopTicking()
      } else {
        _callIfTruthy(this._tickFn, (it) => it(this))
        counter.increment()
      }
    }

    this.timerHandle = setInterval(doTickAndAutoStopCheck, delayMs)

    _callIfTruthy(this._startFn, (it) => it(this))

    DEBUG && console.log(name ?? "Timer", "started, timerHandle = ", this.timerHandle)
  }

  actuallyStop() {
    const { name } = this
    DEBUG && console.log(name ?? "Timer", "stop called, timerHandle = ", this.timerHandle)

    if (this.timerHandle) {
      clearInterval(this.timerHandle)
      this.timerHandle = undefined
    }

    _callIfTruthy(this._stopFn, (it) => it(this))

    DEBUG && console.log(name ?? "Timer", "stopped, timerHandle = ", this.timerHandle)
  }

  // Misc methods.

  toString(): string {
    const { counter, delayMs, name, state, durationMs } = this
    return `name: '${name}', delay: ${delayMs}ms, ${
      durationMs !== NoDuration ? `duration:${durationMs}ms` : ""
    }counter:${counter.value}, state:${state.runtimeStatus}`
  }

  // Getter and setter for counter.

  get counter(): Counter {
    return this._counter
  }

  set counter(value: Counter) {
    this._counter = value
  }

  // Getter and setter for onStop.

  get onStop(): Nullable<TimerTickFn> {
    return this._stopFn
  }

  set onStop(value: Nullable<TimerTickFn>) {
    _callIfTruthy(value, (it) => {
      this._stopFn = it
    })
  }

  // Getter and setter for onStart.

  get onStart(): Nullable<TimerTickFn> {
    return this._startFn
  }

  set onStart(value: Nullable<TimerTickFn>) {
    _callIfTruthy(value, (it) => {
      this._startFn = it
    })
  }

  // Getter and setter for onTick.

  get onTick(): Nullable<TimerTickFn> {
    return this._tickFn
  }

  set onTick(value: Nullable<TimerTickFn>) {
    _callIfTruthy(value, (it) => {
      this._tickFn = it
    })
  }
}
