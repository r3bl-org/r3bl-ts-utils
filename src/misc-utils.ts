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

import { ColorConsole, Styles } from "./color-console-utils"

export const sleep = (ms: number = 500) => {
  const sprites = ["-", "\\", "-", "/"]

  let count = 0
  const printDotsInterval = setInterval(() => {
    ColorConsole.create(Styles.Primary.cyan)(
      "Sleep " + sprites[count++ % sprites.length]
    ).consoleLogInPlace()
  }, 100)

  return new Promise<void>((resolveFn) => {
    setTimeout(() => {
      clearInterval(printDotsInterval)
      console.log()
      resolveFn()
    }, ms)
  })
}
