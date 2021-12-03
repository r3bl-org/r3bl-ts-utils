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

import { _also, _let } from "../kotlin-lang-utils"
import { Cache, EvictionPolicy, PopulateFn } from "./index"

const DEBUG = false

export class CacheImpl<K, V> implements Cache<K, V> {
  private readonly _map = new Map<K, V>()
  private readonly analytics = new CacheAnalytics<K>()

  constructor(
    readonly name: string,
    readonly maxSize: number,
    readonly evictionPolicy: EvictionPolicy
  ) {}

  clear(): void {
    const { _map: map } = this
    map.clear()
  }

  get = (arg: K, keyNotFoundFn: PopulateFn<K, V>): V => {
    const { _map: map, analytics, cleanUp } = this

    analytics.update(arg)

    return map.has(arg)
      ? _let(map.get(arg), (value) => {
          if (!value) throw Error(`Value could not be found for key: ${arg}`)
          return value!
        })
      : _also(keyNotFoundFn(arg), (value) => {
          map.set(arg, value)
          cleanUp()
        })
  }

  cleanUp = () => {
    const { _map: map, maxSize, evictionPolicy: policy, analytics } = this
    if (map.size <= maxSize) return

    let keyToDelete: K | undefined = undefined

    function lru() {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
      keyToDelete = map.keys().next().value
    }

    function lfu() {
      let minValue: number | undefined = undefined
      DEBUG && console.log(analytics.heatmap)
      for (const [key, value] of analytics.heatmap.entries()) {
        if (!minValue) minValue = value
        if (value <= minValue!) keyToDelete = key
        DEBUG && console.log("❕", key, "|", value, "|", minValue, "|", keyToDelete)
      }
    }

    switch (policy) {
      case "least-recently-used":
        lru()
        break
      case "least-frequently-used":
        lfu()
        break
    }

    if (keyToDelete) {
      DEBUG && console.log("🪓 keyToDelete", keyToDelete)
      map.delete(keyToDelete)
      analytics.heatmap.delete(keyToDelete)
      analytics.evictions++
    }
  }

  put = (arg: K, value: V): void => {
    const { _map: map } = this
    map.set(arg, value)
  }

  contains = (arg: K): boolean => this._map.has(arg)

  get size(): number {
    return this._map.size
  }
}

class CacheAnalytics<K> {
  evictions: number = 0

  constructor(readonly heatmap = new Map<K, number>()) {}

  update(key: K) {
    const { heatmap: hm } = this
    const count = !hm.get(key) ? 1 : hm.get(key)! + 1
    hm.set(key, count)
  }
}
