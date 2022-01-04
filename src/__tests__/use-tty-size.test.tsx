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

import { Text } from "ink"
import { render } from "ink-testing-library"
import * as React from "react"
import { useTTYSize } from "../index"

// https://github.com/vadimdemedes/ink/blob/master/readme.md#testing
test("hook works", () => {
  const propsObj = { rows: -1, columns: -1 }
  const TestEl = () => {
    const ttySize = useTTYSize()
    propsObj.rows = ttySize.rows
    propsObj.columns = ttySize.columns
    return <Text>Test</Text>
  }
  const { lastFrame } = render(<TestEl/>)
  expect(lastFrame()).toEqual("Test")
  expect(propsObj.rows).not.toEqual(-1)
  expect(propsObj.columns).not.toEqual(-1)
})

