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

// Module re-exports: https://www.typescriptlang.org/docs/handbook/modules.html
export * from "./externals"

import { CacheImpl } from "./cache-impl"
import { Cache, EvictionPolicy } from "./externals"

/**
 * cache-utils is a module that exposes very little to the users of this module by defining a clear
 * boundary between external and internal facing code.
 *
 * The trick that `index.ts` inside the timer-utils folder only exposes symbols that are defined
 * in `externals.ts`. The factory function `createCache()` eliminates the need to access the
 * internal implementation `CacheImpl` class by any external code.
 *
 * On the other side (code using this library) the folder itself is imported, not a specific
 * file, using `import * as timer from "./cache-utils"`. Here, `cache-utils` is a folder,
 * and not a file.
 *
 * Internal
 * --------
 * For code inside this module, everything is openly exposed and is considered internal. Inside the
 * module, there are no protections in place. All symbols are internal except the ones that are
 * exposed via `externals.ts` and the `index.ts` file.
 *
 * External
 * --------
 * For users of this module, who don't care about the internal details of this module (and they
 * shouldn't have to), the main file is `externals.ts`. This following symbols are
 * exported by `index.ts`.
 *
 * 0. index.ts         <- Re-export all the external symbols (and factory function)
 * 1. externals.ts     <- External interfaces, types
 */

/** Factory function to create an object that implements (external) Cache interface. */
export const createCache = <K, V>(
  name: string,
  maxSize: number,
  policy: EvictionPolicy
): Cache<K, V> => new CacheImpl<K, V>(name, maxSize, policy)
