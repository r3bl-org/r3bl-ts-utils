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

import { _callIfTruthy } from "./misc-utils"

const DEBUG = false

export class Timer {
  public timerId: NodeJS.Timeout | undefined
  private _tickFn: TimerTickFn | undefined
  private _stopFn: TimerTickFn | undefined
  private _counter: Counter = new Counter()
  private state: TimerReducer.State = TimerReducer.reducerFn(undefined, { type: "noop" }, this)

  constructor(readonly name: string, readonly delayMs: number, readonly durationMs: number = -1) {}

  toString(): string {
    return `name: ${this.name}, delay: ${this.delayMs}ms, counter:${this.counter.value}`
  }

  /** Once stop() is called, this is set and can't be reset. */
  get isStopped(): boolean {
    return this.state.isStopped
  }

  /** Once start() is called, this is set and can't be reset. */
  get isStarted(): boolean {
    return this.state.isStarted
  }

  private get isTimerIdDefined(): boolean {
    return !!this.timerId // true if timerId is defined.
  }

  get currentCount(): number {
    return this.counterValue
  }

  get counterValue(): number {
    return this.counter.value
  }

  get counter(): Counter {
    return this._counter
  }

  set counter(value: Counter) {
    this._counter = value
  }

  set stopFn(value: TimerTickFn) {
    this._stopFn = value
  }

  set onStop(value: TimerTickFn) {
    this.stopFn = value
  }

  set tickFn(value: TimerTickFn) {
    this._tickFn = value
  }

  set onTick(value: TimerTickFn) {
    this.tickFn = value
  }

  startTicking(): this {
    this.start()
    return this
  }

  start() {
    this.state = TimerReducer.reducerFn(this.state, { type: "start", startTime: Date.now() }, this)
  }

  stopTicking(): this {
    this.stop()
    return this
  }

  stop() {
    this.state = TimerReducer.reducerFn(this.state, { type: "stop", stopTime: Date.now() }, this)
  }

  _actuallyStartTimer() {
    DEBUG && console.log(this.name ?? "Timer", "start called, timerId = ", this.timerId)

    const doTickAndAutoStopCheck = () => {
      if (this.durationMs > 0 && Date.now() - this.state.startTime >= this.durationMs) {
        this.stop()
      } else {
        _callIfTruthy(this._tickFn, (it) => it(this))
        this.counter.increment()
      }
    }

    this.timerId = setInterval(doTickAndAutoStopCheck, this.delayMs)

    DEBUG && console.log(this.name ?? "Timer", "started, timerId = ", this.timerId)
  }

  _actuallyStopTimer() {
    DEBUG && console.log(this.name ?? "Timer", "stop called, timerId = ", this.timerId)

    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = undefined
    }

    _callIfTruthy(this._stopFn, (it) => it(this))

    DEBUG && console.log(this.name ?? "Timer", "stopped, timerId = ", this.timerId)
  }
}

export type TimerTickFn = (timer: Timer) => void

export const TimerErrors = {
  AlreadyStarted: new Error("Timer has already been started"),
  NotStarted: new Error("Timer has not been started & it can't be stopped"),
  AlreadyStopped: new Error("Timer has already been stopped & can't be stopped again"),
} as const

export class Counter {
  private count: number

  constructor(startCount = 0) {
    this.count = startCount
  }

  get value(): number {
    return this.count
  }

  increment = () => this.count++

  getAndIncrement = () => {
    let retval = this.count
    this.count++
    return retval
  }
}

namespace TimerReducer {
  interface StartAction {
    type: "start"
    startTime: number
  }
  interface StopAction {
    type: "stop"
    stopTime: number
  }
  interface NoOpAction {
    type: "noop"
  }
  export type Actions = StartAction | StopAction | NoOpAction

  export interface State {
    isStarted: boolean
    isStopped: boolean
    startTime: number
    stopTime: number
  }

  /**
   * @param currentState
   * @param action
   * @param timer
   * @throws TimerErrors
   */
  export function reducerFn(currentState: State | undefined, action: Actions, timer: Timer): State {
    if (!currentState)
      return {
        isStarted: false,
        isStopped: false,
        startTime: 0,
        stopTime: 0,
      }

    switch (action.type) {
      case "noop": {
        return currentState
      }
      case "start":
        if (currentState.isStarted) throw TimerErrors.AlreadyStarted
        if (currentState.startTime == 0) {
          timer._actuallyStartTimer()
          return { ...currentState, isStarted: true, startTime: action.startTime }
        }
        break
      case "stop":
        if (!currentState.isStarted) throw TimerErrors.NotStarted
        if (currentState.isStopped) throw TimerErrors.AlreadyStopped
        if (currentState.stopTime == 0) {
          timer._actuallyStopTimer()
          return { ...currentState, isStopped: true, stopTime: action.stopTime }
        }
        break
    }

    return currentState
  }
}
