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

import { waitFor } from "@testing-library/react"
import {
  _also,
  _callIfTruthy,
  Counter,
  createTimer,
  Timer,
  TimerErrors,
  TimerRegistry,
} from "../index"
import { NoDuration } from "../timer-utils/timer-impl"

describe("Counter", () => {
  test("Can be constructed with an initial value", () => {
    const counter = new Counter(12)
    expect(counter.value).toEqual(12)
  })

  test("Can increment()", () => {
    const counter = new Counter(0)
    counter.increment()
    expect(counter.value).toEqual(1)
  })

  test("Can getAndIncrement()", () => {
    const counter = new Counter(1)
    expect(counter.getAndIncrement()).toEqual(1)
    expect(counter.value).toEqual(2)
  })
})

describe("Timer", () => {
  test("Can start & stop a new timer (happy path 😊)", async () => {
    let count = 0
    let onStartCalled = false
    let onStopCalled = false

    const timer: Timer = _also(createTimer("test", 100), (it) => {
      it.setOnTickFn(() => count++)
      it.setOnStartFn(() => (onStartCalled = true))
      it.setOnStopFn(() => (onStopCalled = true))
    })
    expect(onStartCalled).toBeFalsy()
    expect(onStopCalled).toBeFalsy()

    timer.startTicking()

    expect(onStartCalled).toBeTruthy()
    expect(timer.isCreatedAndNotStarted).toBeFalsy()
    expect(timer.isRunning).toBeTruthy()

    await waitFor(() => expect(count).toBeGreaterThan(0))

    timer.stopTicking()

    expect(onStopCalled).toBeTruthy()
    expect(timer.isStopped).toBeTruthy()
    expect(timer.isRunning).toBeFalsy()
  })

  test("Can't stop a stopped timer", () => {
    let count = 0
    const timer: Timer = _also(createTimer("test", 100), (it) => {
      it.setOnTickFn(() => count++)
    })
    expect(() => timer.stopTicking()).toThrow(TimerErrors.CantStop_NotStarted)
  })

  test("Can't start a started timer", () => {
    let count = 0
    const timer: Timer = _also(createTimer("test", 100), (it) => {
      it.setOnTickFn(() => count++)
    })
    timer.startTicking()
    expect(() => timer.startTicking()).toThrow(TimerErrors.CantStart_AlreadyRunning)
    timer.stopTicking()
  })

  test("Can't restart a stopped timer (they aren't reusable)", () => {
    let count = 0
    const timer: Timer = _also(createTimer("test", 100), (it) => {
      it.setOnTickFn(() => count++)
    })
    timer.startTicking()
    timer.stopTicking()
    expect(() => timer.startTicking()).toThrow(TimerErrors.CantStart_AlreadyStopped)
    expect(() => timer.stopTicking()).toThrow(TimerErrors.CantStop_AlreadyStopped)
  })

  const [delay, timeout, maxCount, duration] = [5, 100, 5, 50]

  test("Started timer calls supplied _tickFn and counts up as expected", async () => {
    let count = 0

    const timer: Timer = _also(createTimer("test", delay, NoDuration, new Counter()), (timer) => {
      timer.setOnTickFn(() =>
        _callIfTruthy(timer.counter, (counter) => {
          counter.value < maxCount ? count++ : undefined
        })
      )
    })

    _also(timer.startTicking(), (it) => expect(it).toBe(timer))

    setTimeout(() => {
      _also(timer.stopTicking(), (it) => expect(it).toBe(timer))
    }, timeout)

    // More info: https://testing-library.com/docs/dom-testing-library/api-async/#waitfor
    await waitFor(() => expect(timer.counter?.value).toBeGreaterThanOrEqual(maxCount))
    expect(count).toEqual(maxCount)
  })

  test("Stopped Timer calls supplied _stopFn as expected", async () => {
    let count = 0
    let stopped = false

    const timer: Timer = _also(createTimer("test", delay, NoDuration, new Counter()), (it) => {
      it.setOnTickFn(() =>
        _callIfTruthy(it.counter, (counter) => {
          counter.value < maxCount ? count++ : undefined
        })
      )
      it.setOnStopFn(() => (stopped = true))
    })

    timer.startTicking()

    setTimeout(() => {
      timer.stopTicking()
      expect(stopped).toBeTruthy()
    }, timeout)

    // More info: https://testing-library.com/docs/dom-testing-library/api-async/#waitfor
    await waitFor(() => expect(timer.counter?.value).toBeGreaterThanOrEqual(maxCount))
    expect(count).toEqual(maxCount)
  })

  test("Started timer stops itself after duration has passed", (done) => {
    let count = 0

    const timer: Timer = _also(createTimer("test", delay, duration), (it) => {
      it.setOnTickFn(() => count++)
    })

    timer.startTicking()

    setTimeout(() => {
      expect(timer.isStopped).toBeTruthy()
      done()
    }, duration + delay)
  })

  test("All created timers can be killed", () => {
    // Clear out TimerRegistry.
    const array: Timer[] = TimerRegistry["timers"]
    while (array.length) array.pop()

    // Create 3 timers in different states.

    _also(createTimer("isStopped", 0), (it) => {
      it.startTicking()
      it.stopTicking()
    })

    _also(createTimer("isRunning", 0), (it) => {
      it.startTicking()
    })

    createTimer("isCreatedAndNotStarted", 0)

    // Check that the states of the 3 timers are what is expected.

    _also(
      array.filter((it) => it.isRunning),
      (it) => expect(it.length).toBe(1)
    )

    _also(
      array.filter((it) => it.isStopped),
      (it) => expect(it.length).toBe(1)
    )

    _also(
      array.filter((it) => it.isCreatedAndNotStarted),
      (it) => expect(it.length).toBe(1)
    )

    // Kill all the timers & make sure they're dead.

    TimerRegistry.killAll()

    _also(
      array.filter((it) => it.isRunning),
      (it) => expect(it.length).toBe(0)
    )
  })
})
