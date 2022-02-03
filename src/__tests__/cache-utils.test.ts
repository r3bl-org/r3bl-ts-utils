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

import { createCache, _repeat } from "../index"

describe("Cache", () => {
  test("can createCache a Cache", () => {
    const cache = createCache("test", 3, "least-frequently-used")
    expect(cache).toBeTruthy()
    expect(cache.name).toEqual("test")
    expect(cache.maxSize).toEqual(3)
    expect(cache.evictionPolicy).toEqual("least-frequently-used")
    expect(cache.size).toBe(0)
  })

  test("Can put into and clear Cache", () => {
    const cache = createCache<string, string>("test", 2, "least-frequently-used")

    // Put "foo" in cache.
    cache.put("foo", "foo_test")
    expect(cache.get("foo")).toEqual("foo_test")

    // Clear the cache.
    cache.clear()
    expect(cache.size).toEqual(0)
  })

  test("can getAndComputeIfAbsent from Cache", () => {
    const populateFn = (arg: string): string => arg + "_test"
    const cache = createCache<string, string>("test", 2, "least-frequently-used")

    // Cache miss for "foo" -> insert.
    expect(cache.getAndComputeIfAbsent("foo", populateFn)).toEqual("foo_test")
    expect(cache.size).toEqual(1)
    expect(cache.contains("foo")).toBeTruthy()

    // Cache miss for "bar" -> insert.
    expect(cache.getAndComputeIfAbsent("bar", populateFn)).toEqual("bar_test")
    expect(cache.size).toEqual(2)
    expect(cache.contains("bar")).toBeTruthy()

    // Cache hit for "foo"!
    expect(cache.getAndComputeIfAbsent("foo", populateFn)).toEqual("foo_test")
    expect(cache.size).toEqual(2)
    expect(cache.contains("foo")).toBeTruthy()

    // Cache hit for "bar"!
    expect(cache.getAndComputeIfAbsent("bar", populateFn)).toEqual("bar_test")
    expect(cache.size).toEqual(2)
    expect(cache.contains("bar")).toBeTruthy()
  })

  test("can getAndComputeIfAbsentAsync from Cache", async () => {
    let executionCount = 0
    const populateAsyncFn = (arg: string): Promise<string> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(arg + "_test")
          executionCount++
        }, 10)
      })
    }
    const cache = createCache<string, string>("test", 2, "least-frequently-used")

    // Cache miss for "foo" -> insert.
    await expect(cache.getAndComputeIfAbsentAsync("foo", populateAsyncFn)).resolves.toEqual(
      "foo_test"
    )

    // Cache hit for "foo".
    expect(cache.contains("foo")).toBeTruthy()
    await expect(cache.getAndComputeIfAbsentAsync("foo", populateAsyncFn)).resolves.toEqual(
      "foo_test"
    )
    expect(executionCount).toBe(1)
  })

  test("Cache eviction policy least-recently-used works", () => {
    const populateFn = (arg: string): string => arg + "_test"
    const cache = createCache<string, string>("test", 2, "least-recently-used")

    cache.getAndComputeIfAbsent("foo", populateFn)
    cache.getAndComputeIfAbsent("bar", populateFn)
    cache.getAndComputeIfAbsent("baz", populateFn)

    expect(cache.size).toEqual(2)
    expect(cache.contains("foo")).toBeFalsy()
    expect(cache.contains("bar")).toBeTruthy()
    expect(cache.contains("baz")).toBeTruthy()
  })

  test("Cache eviction policy least-frequently-used works", () => {
    const populateFn = (arg: string): string => arg + "_test"
    const cache = createCache<string, string>("test", 2, "least-frequently-used")

    _repeat(3, () => cache.getAndComputeIfAbsent("foo", populateFn))
    _repeat(2, () => cache.getAndComputeIfAbsent("bar", populateFn))
    cache.getAndComputeIfAbsent("baz", populateFn)

    expect(cache.size).toEqual(2)
    expect(cache.contains("foo")).toBeTruthy()
    expect(cache.contains("bar")).toBeTruthy()
    expect(cache.contains("baz")).toBeFalsy()
  })
})
