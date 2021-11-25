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
export * from "./counter"
export * from "./externals"
export * from "./timer-impl"

import { Timer } from "./externals"
import { TimerImpl } from "./timer-impl"

/*
 * timer-utils is a module that exposes very little to the users of this module by defining a clear
 * boundary between external and internal facing interfaces.
 *
 * For code inside this module, everything is openly exposed and is considered internal. Inside the
 * module, there are no protections in place.
 *
 * For users of this module, who don't care about the internal details of this module (and they
 * shouldn't have to), the main file is `externals.ts`. This file exposes via `index.ts` all the
 * interfaces that need to be visible to (external) users of this (library) module. Additionally,
 * `index.ts` exposes a factory function that should be used to get instances of `Timer` instead of
 * directly calling the constructor on `TimerImpl`.
 */

/* Factory function to create an object that implements (external) Timer interface. */
export const createTimer = (name: string, delay: number, duration?: number): Timer => {
  return new TimerImpl(name, delay, duration)
}
