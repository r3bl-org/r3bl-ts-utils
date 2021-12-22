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

import { stdout } from "test-console" // https://github.com/jamesshore/test-console
import { printHeader, StyledColorConsole } from "../color-console-utils"
import { _also } from "../kotlin-lang-utils"

test("color-console-utils works", () => {
  _also(
    stdout.inspectSync(() => printHeader(
      "Very long test string. Very long test string. Very long test string. Very long test string. Very long test string. Very long test string. Very long test string. Very long test string. ")
    ),
    (output: ReadonlyArray<string>) => {
      expect(output[0]).toContain("Very long test string.")
    }
  )
  
  _also(
    stdout.inspectSync(() => printHeader("Short test string!🌈")),
    (output: ReadonlyArray<string>) => {
      expect(output[0]).toContain("Short test string!🌈")
    }
  )
  
  _also(
    stdout.inspectSync(() => StyledColorConsole.Primary("primary color").consoleLog()),
    (output: ReadonlyArray<string>) => {
      expect(output[0]).toContain("primary color")
    }
  )
  
  _also(
    stdout.inspectSync(() => StyledColorConsole.Secondary("secondary color").consoleLog()),
    (output: ReadonlyArray<string>) => {
      expect(output[0]).toContain("secondary color")
    }
  )
})
