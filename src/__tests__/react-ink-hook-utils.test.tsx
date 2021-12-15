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

import { Text } from "ink"
import { render } from "ink-testing-library"
import * as React from "react"
import { _also, UserInputKeyPress, useTTYSize } from "../index"

// https://github.com/vadimdemedes/ink/blob/master/readme.md#testing
describe("useTTYSize", () => {
  test("hook works", () => {
    const propsObj = { rows: -1, columns: -1 }
    const Test = () => {
      const ttySize = useTTYSize()
      propsObj.rows = ttySize.rows
      propsObj.columns = ttySize.columns

      return <Text>Test</Text>
    }
    const { lastFrame } = render(<Test />)
    expect(lastFrame()).toEqual("Test")
    expect(propsObj.rows).not.toEqual(-1)
    expect(propsObj.columns).not.toEqual(-1)
  })
})

describe("useKeyboard", () => {
  test("UserInputKeyPress works", () => {
    _also(new UserInputKeyPress(undefined, undefined), (it) => {
      expect(it.toString()).toEqual("")
    })

    _also(new UserInputKeyPress("a", undefined), (it) => {
      expect(it.toString()).toEqual("a")
      expect(it.input).toEqual("a")
      expect(it.key).toEqual("")
    })

    _also(
      new UserInputKeyPress("a", {
        backspace: false,
        ctrl: true,
        delete: false,
        downArrow: false,
        escape: false,
        leftArrow: false,
        meta: false,
        pageDown: false,
        pageUp: false,
        return: false,
        rightArrow: false,
        shift: false,
        tab: false,
        upArrow: false,
      }),
      (it) => {
        expect(it.toString()).toEqual("ctrl+a")
        expect(it.input).toEqual("a")
        expect(it.key).toEqual("ctrl")
      }
    )

    _also(
      new UserInputKeyPress(undefined, {
        backspace: false,
        ctrl: false,
        delete: false,
        downArrow: false,
        escape: true,
        leftArrow: false,
        meta: false,
        pageDown: false,
        pageUp: false,
        return: false,
        rightArrow: false,
        shift: false,
        tab: false,
        upArrow: false,
      }),
      (it) => {
        expect(it.toString()).toEqual("escape")
        expect(it.input).toEqual("")
        expect(it.key).toEqual("escape")
      }
    )
  })
})
