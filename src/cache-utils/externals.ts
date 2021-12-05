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

export interface Cache<K, V> {
  name: string
  maxSize: number
  size: number
  evictionPolicy: EvictionPolicy
  get: (arg: K) => V | undefined
  getAndComputeIfAbsent: (arg: K, populateFn: ComputeValueForKeyFn<K, V>) => V
  put: (arg: K, value: V) => void
  contains(arg: K): boolean
  clear: () => void
}

export type EvictionPolicy = "least-frequently-used" | "least-recently-used"

export type ComputeValueForKeyFn<K, V> = (arg: K) => V
