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

import React from "react"
import { emptyArray, makeReactElementFromArray, RenderItemFn } from "../index"

test("emptyArray works", () => {
  expect(emptyArray()).toHaveLength(0)
})

test("makeReactElementFromArray works", () => {
  const renderEachInput: RenderItemFn<string> = function (inputItem, index) {
    return <li key={index}>{inputItem}</li>
  }
  const inputArray = ["one", "two", "three"]
  const element = makeReactElementFromArray(inputArray, renderEachInput)
  expect(element.props.children).toHaveLength(3) // eslint-disable-line
})
