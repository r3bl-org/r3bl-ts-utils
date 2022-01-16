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
import { _callIfTrue } from "../misc-lang-utils"
import { Counter } from "./counter"
import { Timer } from "./externals"
import { TimerImpl } from "./timer-impl"

/* Module re-exports: https://www.typescriptlang.org/docs/handbook/modules.html */
export * from "./counter"
export * from "./externals"

/**
 * timer-utils is a module that exposes very little to the users of this module by defining a clear
 * boundary between external and internal facing code.
 *
 * The trick that `index.ts` inside the timer-utils folder only exposes symbols that are defined
 * in `externals.ts`. The factory function `createTimer()` eliminates the need to access the
 * internal implementation `TimerImpl` class by any external code.
 *
 * On the other side (code using this library) the folder itself is imported, not a specific
 * file, using `import * as timer from "./timer-utils"`. Here, `timer-utils` is a folder,
 * and not a file.
 *
 * Internal
 * --------
 * For code inside this module, everything is openly exposed and is considered internal. Inside the
 * module, there are no protections in place. Here are the files that are internal only.
 *
 * 1. internals.ts      <- Internal interfaces, types
 * 2. timer-reducer.ts  <- Internal functions, interfaces, types
 * 3. timer-impl.ts     <- Internal classes, interfaces, functions
 *
 * External
 * --------
 * For users of this module, who don't care about the internal details of this module (and they
 * shouldn't have to), the main file is `externals.ts`. This following symbols are
 * exported by `index.ts`.
 *
 * 0. index.ts         <- Re-export all the external symbols (and factory function)
 * 1. counter.ts       <- External class
 * 2. timer-impl.ts    <- External class
 * 3. externals.ts     <- External interfaces, types
 */

/** Factory function to create an object that implements (external) Timer interface. */
export const createTimer = (
  name: string,
  delay: number,
  duration?: number,
  counter?: Counter
): Timer => _also(new TimerImpl(name, delay, duration, counter), TimerRegistry.add)

export class TimerRegistry {
  private static readonly timers: Timer[] = []

  static killAll = () => TimerRegistry.timers.forEach(TimerRegistry.killIfRunning)

  private static killIfRunning = (timer: Timer) => _callIfTrue(timer.isRunning, timer.stopTicking)

  static add = (timer: Timer) => TimerRegistry.timers.push(timer)
}
