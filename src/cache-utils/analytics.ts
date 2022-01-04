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

import { _also } from "../kotlin-lang-utils"
import { CacheImpl } from "./cache-impl"
import { DEBUG } from "./debug"

// eslint-disable-next-line
export namespace Analytics {
  // Exposed outside of namespace.
  
  export const createInstance = <K>(): KeyHistory<K> => new Impl<K>()
  
  export interface KeyHistory<K> {
    update(key: K): void
    
    purge(key: K): void
    
    findLRUKey<K, V>(cache: CacheImpl<K, V>): K
    
    findLFUKey(): K
  }
  
  // ENHANCEMENT Create more complex eviction & refresh policies w/ insertionTime & lastAccessTime
  export class Insight {
    /* Num of times key was accessed, used to calculate popularity. */
    accessCount = 1
    /* Time at which the key was inserted, used to calculate age. */
    insertionTime: number = Date.now()
    /* Time at which key was last accessed, used to calculate recency. */
    lastAccessTime: number = Date.now()
  }
  
  // Hidden inside namespace.
  
  class Impl<K> implements KeyHistory<K> {
    readonly heatmap = new Map<K, Insight>()
    evictions = 0
    
    update = (key: K) => {
      const { heatmap: hm } = this
      hm.has(key)
        ? _also(hm.get(key), (hmEntry) => {
          if (!hmEntry) {
            // eslint-disable-next-line
            throw new Error(`Cache entry for key ${key} should not be null / undefined!`)
          }
          hmEntry.accessCount++
          hmEntry.lastAccessTime = Date.now()
        })
        : _also(new Insight(), (it) => {
          hm.set(key, it)
        })
    }
    
    purge = (keyToDelete: K) => {
      this.heatmap.delete(keyToDelete)
      this.evictions++
    }
    
    findLRUKey = <K, V>(cache: CacheImpl<K, V>): K => {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
      return cache._map.keys().next().value as K
    }
    
    findLFUKey = (): K => {
      let keyToDelete: K | undefined = undefined
      let minCount: number | undefined = undefined
      
      DEBUG && console.log(this.heatmap)
      
      for (const [ key, insight ] of this.heatmap.entries()) {
        if (!minCount) minCount = insight.accessCount
        if (insight.accessCount <= minCount) keyToDelete = key
        DEBUG && console.log("[findLFUKey]", key, "|", insight, "|", minCount, "|", keyToDelete)
      }
      
      if (!keyToDelete)
        throw new Error("Could not find keyToDelete (can't be nullish) in Policy.findLFUKey!")
      return keyToDelete
    }
  }
}
