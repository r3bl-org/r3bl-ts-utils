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

import { render } from "@testing-library/react"
import * as React from "react"
import { FC } from "react"
import { _withRef, ReactRef } from "../index"

interface GlobalState {
  myRef: ReactRef<boolean> | null
  myFlag: boolean
}

const myGlobalState: GlobalState = {
  myFlag: false,
  myRef: null,
}

const resetMyGlobalState = () => {
  myGlobalState.myFlag = false
  myGlobalState.myRef = null
}

beforeEach(resetMyGlobalState)
afterEach(resetMyGlobalState)

const MyFC: FC = () => {
  const myRef = React.useRef(true)
  myGlobalState.myRef = myRef
  _withRef(myRef, function () {
    myGlobalState.myFlag = true
  })
  return <></>
}

const MyFC2: FC = () => {
  const myRef = React.useRef()
  myGlobalState.myRef = myRef
  _withRef(myRef, function () {
    myGlobalState.myFlag = true
  })
  return <></>
}

describe("_withRef", () => {
  test("lambda executes when current property is truthy", () => {
    render(React.createElement(MyFC, null))
    expect(myGlobalState.myRef?.current).toBeTruthy()
    expect(myGlobalState.myFlag).toBeTruthy()
  })
  
  test("lambda does not execute when current property is falsy", () => {
    render(React.createElement(MyFC2, null))
    expect(myGlobalState.myRef?.current).toBeFalsy()
    expect(myGlobalState.myFlag).toBeFalsy()
  })
})
