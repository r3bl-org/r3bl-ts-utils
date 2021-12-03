import { CacheImpl } from "./cache-impl"

export interface Cache<K, V> {
  name: string
  maxSize: number
  evictionPolicy: EvictionPolicy
  get: (arg: K, populateFn: PopulateFn<K, V>) => V
  put: (arg: K, value: V) => void
  clear: () => void
}

export type EvictionPolicy = "least-frequently-used" | "least-recently-used"

export type PopulateFn<K, V> = (arg: K) => V

export function createCache<K, V>(name: string, maxSize: number, policy: EvictionPolicy) {
  return new CacheImpl<K, V>(name, maxSize, policy)
}
