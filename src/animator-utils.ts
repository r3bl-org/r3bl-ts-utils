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

const DEBUG = false

export class Animator {
  public timerId: NodeJS.Timeout | null = null

  constructor(
    readonly name: string,
    readonly delayMs: number,
    readonly tickFn: AnimatorTickFn,
    readonly counter: Counter = new Counter()
  ) {}

  toString = (): string =>
    `name: ${this.name}, delay: ${this.delayMs}ms, counter:${this.counter.value}`

  get isStarted(): boolean {
    return !!this.timerId
  }

  get currentCount(): number {
    return this.counter.value
  }

  start = () => {
    DEBUG && console.log(this.name ?? "Animator", "start called, timerId = ", this.timerId)

    if (this.isStarted) throw new Error(AnimatorErrorTypes.TimerAlreadyStarted)

    this.timerId = setInterval(() => {
      this.tickFn(this)
      this.counter.increment()
    }, this.delayMs)
    DEBUG && console.log(this.name ?? "Animator", "started, timerId = ", this.timerId)
  }

  stop = () => {
    DEBUG && console.log(this.name ?? "Animator", "stop called, timerId = ", this.timerId)

    if (!this.isStarted) throw new Error(AnimatorErrorTypes.TimerNotStarted)

    clearInterval(this.timerId!!)
    this.timerId = null
    DEBUG && console.log(this.name ?? "Animator", "stopped, timerId = ", this.timerId)
  }
}

export type AnimatorTickFn = (animator: Animator) => void

export const AnimatorErrorTypes = {
  TimerAlreadyStarted: "Animator has already been started, can't restart it until after it stops",
  TimerNotStarted: "Animator has not been started, can't be stopped",
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
