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
import { Analytics } from "./analytics"
import { DEBUG } from "./debug"
import { Cache, ComputeValueForKeyFn, EvictionPolicy } from "./externals"

export class CacheImpl<K, V> implements Cache<K, V> {
  readonly _map = new Map<K, V>()
  readonly analytics: Analytics.KeyHistory<K> = Analytics.createInstance<K>()

  constructor(
    readonly name: string,
    readonly maxSize: number,
    readonly evictionPolicy: EvictionPolicy
  ) {}

  clear = (): void => {
    const { _map: map } = this
    map.clear()
  }

  get = (arg: K): V | undefined => {
    const { _map: map, analytics } = this

    analytics.update(arg)

    return map.has(arg)
      ? _let(map.get(arg), (value) => {
          // eslint-disable-next-line
          if (!value) throw Error(`Value could not be found for key: ${arg}`)
          return value
        })
      : undefined
  }

  getAndComputeIfAbsent = (arg: K, keyNotFoundFn: ComputeValueForKeyFn<K, V>): V => {
    const { _map: map, analytics, cleanUp } = this

    analytics.update(arg)

    return map.has(arg)
      ? _let(map.get(arg), (value) => {
          // eslint-disable-next-line
          if (!value) throw Error(`Value could not be found for key: ${arg}`)
          return value
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

    switch (policy) {
      case "least-recently-used":
        keyToDelete = analytics.findLRUKey(this)
        break
      case "least-frequently-used":
        keyToDelete = analytics.findLFUKey()
        break
    }

    if (keyToDelete) {
      DEBUG && console.log("🪓 keyToDelete", keyToDelete)
      map.delete(keyToDelete)
      analytics.purge(keyToDelete)
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
