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

import { Timer, TimerErrors, Counter } from "../index"
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
    const timer = new Timer("test", 100, (timer) => {
      count++
    })
    timer.start()
    expect(timer.isStarted).toBeTruthy()
    timer.stop()
  })

  test("Can't stop a stopped timer", () => {
    let count = 0
    const timer = new Timer("test", 100, (timer) => {
      count++
    })
    expect(() => timer.stop()).toThrow(TimerErrors.NotStarted)
  })

  test("Can't start a started timer", () => {
    let count = 0
    const timer = new Timer("test", 100, (timer) => {
      count++
    })
    timer.start()
    expect(() => timer.start()).toThrow(TimerErrors.AlreadyStarted)
    timer.stop()
  })

  test("Timer calls tick() and counts up as expected", async () => {
    let count = 0
    const timer = new Timer("test", 100, (timer) => {
      count++
    })
    timer.start()
    setTimeout(() => timer.stop(), 500)
    // More info: https://testing-library.com/docs/dom-testing-library/api-async/#waitfor
    await waitFor(() => expect(timer.counter.value).toEqual(4))
    expect(count).toEqual(4)
  })
})
