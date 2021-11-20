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

import { _also, Counter, Timer, TimerErrors } from "../index"
import { waitFor } from "@testing-library/react"

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
  test("Can start", () => {
    let count = 0
    const timer = _also(new Timer("test", 100), (it) => {
      it.onTick = () => count++
    })
    timer.start()
    expect(timer.isStarted).toBeTruthy()
    timer.stop()
  })

  test("Can't stop a stopped timer", () => {
    let count = 0
    const timer = _also(new Timer("test", 100), (it) => {
      it.onTick = () => count++
    })
    expect(() => timer.stop()).toThrow(TimerErrors.NotStarted)
  })

  test("Can't start a started timer", () => {
    let count = 0
    const timer = _also(new Timer("test", 100), (it) => {
      it.onTick = () => count++
    })
    timer.start()
    expect(() => timer.start()).toThrow(TimerErrors.AlreadyStarted)
    timer.stop()
  })

  const [delay, timeout, maxCount] = [5, 100, 5]

  test("Started timer calls supplied _tickFn and counts up as expected", async () => {
    let count = 0

    const timer: Timer = _also(new Timer("test", delay), (it) => {
      it.onTick = () => (it.counterValue < maxCount ? count++ : undefined)
    })

    _also(timer.startTicking(), (it) => expect(it).toBe(timer))

    setTimeout(() => {
      _also(timer.stopTicking(), (it) => expect(it).toBe(timer))
    }, timeout)

    // More info: https://testing-library.com/docs/dom-testing-library/api-async/#waitfor
    await waitFor(() => expect(timer.counterValue).toBeGreaterThanOrEqual(maxCount))
    expect(count).toEqual(maxCount)
  })

  test("Stopped Timer calls supplied _stopFn as expected", async () => {
    let count = 0
    let stopped = false

    const timer: Timer = _also(new Timer("test", delay), (it) => {
      it.onTick = () => (it.counterValue < maxCount ? count++ : undefined)
      it.stopFn = () => (stopped = true)
    })

    timer.start()

    setTimeout(() => {
      timer.stop()
      expect(stopped).toBeTruthy()
    }, timeout)

    // More info: https://testing-library.com/docs/dom-testing-library/api-async/#waitfor
    await waitFor(() => expect(timer.counterValue).toBeGreaterThanOrEqual(maxCount))
    expect(count).toEqual(maxCount)
  })
})
