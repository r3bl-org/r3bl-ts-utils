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

import { TextColor } from "../tui-colors"

export function logTTYState(msg: string, em = false) {
  console.log(
    em
      ? TextColor.builder.bgWhite.red.bold.build()(msg)
      : TextColor.builder.red.underline.bold.build()(msg)
  )
  // console.log("stdin.isRaw", process.stdin.isRaw)
  // console.log("stdin.isTTY", process.stdin.isTTY)
  console.log("isTTY()", isTTY())
  console.log("isTTYinRawMode()", isTTYinRawMode())
}

export const isTTY = () => process?.stdin?.isTTY
export const isTTYinRawMode = () => process?.stdin?.isTTY && process?.stdin?.isRaw
