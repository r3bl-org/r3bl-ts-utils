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

import { _callIfTruthy, Nullable } from "./misc-utils"
import { _also } from "./kotlin-lang-utils"
const DEBUG = false

// Constants.
const DefaultDuration = -1

export class Timer {
  // Properties (simple).

  private timerHandle?: NodeJS.Timeout

  // Properties (backing fields for getters, setters).

  private _state: TimerReducer.State
  private _tickFn?: TimerTickFn
  private _stopFn?: TimerTickFn
  private _counter: Counter = new Counter()

  constructor(
    readonly name: string,
    readonly delayMs: number,
    readonly durationMs: number = DefaultDuration
  ) {
    this._state = this.dispatch()
  }

  // State management delegated to TimerReducer.

  /**
   * Computes the new state using `TimerReducer.reducerFn` and puts it `this.state` property.
   * @param action if not provided compute initial state, else use it to get new state
   * @return new state object
   */
  private dispatch = (action?: TimerReducer.Actions): TimerReducer.State =>
    _also(TimerReducer.reducerFn(this, this.state, action), (newState) => {
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

  get state(): TimerReducer.State {
    return this._state
  }

  // Logic to start / stop the timer.

  _actuallyStart() {
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

    DEBUG && console.log(name ?? "Timer", "started, timerHandle = ", this.timerHandle)
  }

  _actuallyStop() {
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
      durationMs !== DefaultDuration ? "duration:" + durationMs + "ms" : ""
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

export type TimerTickFn = (timer: Timer) => void

export const TimerErrors = {
  CantStart_AlreadyRunning: new Error("Timer can't be started, its already running"),
  CantStop_NotStarted: new Error("Timer can't be stopped, as it's created but not started"),
  CantStart_AlreadyStopped: new Error("Stopped timer can't be started, please make a new one"),
  CantStop_AlreadyStopped: new Error("Stopped timer can't be stopped, please make a new one"),
}

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
    const { count: oldCount } = this
    this.count++
    return oldCount
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
  export type Actions = StartAction | StopAction

  export interface State {
    runtimeStatus: LifecycleStage
    startTime: number
    stopTime: number
  }
  type LifecycleStage = "created_not_started" | "running" | "stopped"

  type ReducerFnType = (timer: Timer, currentState?: State, action?: Actions) => State

  /**
   * @throws TimerErrors
   */
  export const reducerFn: ReducerFnType = (
    timer: Timer,
    currentState?: State,
    action?: Actions
  ): State => {
    if (!currentState)
      return {
        runtimeStatus: "created_not_started",
        startTime: 0,
        stopTime: 0,
      }

    const { runtimeStatus } = currentState
    const {
      CantStart_AlreadyStopped,
      CantStart_AlreadyRunning,
      CantStop_AlreadyStopped,
      CantStop_NotStarted,
    } = TimerErrors

    if (action)
      switch (action.type) {
        case "start":
          if (runtimeStatus === "created_not_started") return startFn(timer, currentState, action)
          if (runtimeStatus === "stopped") throw CantStart_AlreadyStopped
          if (runtimeStatus === "running") throw CantStart_AlreadyRunning
          break
        case "stop":
          if (runtimeStatus === "created_not_started") throw CantStop_NotStarted
          if (runtimeStatus === "stopped") throw CantStop_AlreadyStopped
          if (runtimeStatus === "running") return stopFn(timer, currentState, action)
          break
      }

    return currentState
  }

  function stopFn(timer: Timer, currentState: State, action: StopAction): State {
    timer._actuallyStop()
    return { ...currentState, runtimeStatus: "stopped", stopTime: action.stopTime }
  }

  function startFn(timer: Timer, currentState: State, action: StartAction): State {
    timer._actuallyStart()
    return {
      ...currentState,
      runtimeStatus: "running",
      startTime: action.startTime,
    }
  }
}
