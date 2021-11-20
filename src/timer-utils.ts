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

  constructor(readonly name: string, readonly delayMs: number) {}

  toString(): string {
    return `name: ${this.name}, delay: ${this.delayMs}ms, counter:${this.counter.value}`
  }

  get isStarted(): boolean {
    return this.isTimerIdDefined
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

  stopTicking(): this {
    this.stop()
    return this
  }

  start() {
    DEBUG && console.log(this.name ?? "Timer", "start called, timerId = ", this.timerId)

    if (this.isStarted) throw TimerErrors.AlreadyStarted

    this.timerId = setInterval(() => {
      // if (this._tickFn) this._tickFn(this)
      _callIfTruthy(this._tickFn, (it) => it(this))
      this.counter.increment()
    }, this.delayMs)

    DEBUG && console.log(this.name ?? "Timer", "started, timerId = ", this.timerId)
  }

  stop() {
    DEBUG && console.log(this.name ?? "Timer", "stop called, timerId = ", this.timerId)

    if (!this.timerId) throw TimerErrors.NotStarted

    clearInterval(this.timerId)
    this.timerId = undefined

    // if (this._stopFn) this._stopFn(this)
    _callIfTruthy(this._stopFn, (it) => it(this))

    DEBUG && console.log(this.name ?? "Timer", "stopped, timerId = ", this.timerId)
  }
}

export type TimerTickFn = (timer: Timer) => void

export const TimerErrors = {
  AlreadyStarted: new Error(
    "Timer has already been started, can't restart it until after it stops"
  ),
  NotStarted: new Error("Timer has not been started, can't be stopped"),
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
