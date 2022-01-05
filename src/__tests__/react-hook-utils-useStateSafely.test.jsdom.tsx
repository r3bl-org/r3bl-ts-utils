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

import "@testing-library/jest-dom"
import { fireEvent, render, RenderResult } from "@testing-library/react"
import { noop } from "lodash"
import * as React from "react"
import { FC } from "react"
import { ReactRef, SetState, StateHolder, useIsComponentMounted, useStateSafely } from "../index"

/**
 * https://testing-library.com/docs/react-testing-library/api/#render
 */
describe("use-state-safely", () => {
  test("useIsComponentMounted works", () => {
    let isComponentMounted: ReactRef<boolean> | undefined = undefined
    const TestComponent: FC = () => {
      isComponentMounted = useIsComponentMounted()
      return (<p>Test component</p>)
    }
    // https://testing-library.com/docs/react-testing-library/api/#render-result
    const result: RenderResult = render(<TestComponent/>)
    expect(isComponentMounted).toBeDefined()
    expect(isComponentMounted!.current!).toEqual(true)
    expect(result.getByText("Test component")).toBeInTheDocument()
    result.unmount()
    expect(isComponentMounted).toBeDefined()
    expect(isComponentMounted!.current).toEqual(false)
  })
  
  test("useStateSafely as object works", () => {
    const TestComponent: FC = () => {
      const { value, setValue } = useStateSafely("foo")
      return (
        <div>
          <p>{value}</p>
          <button onClick={() => setValue("bar")}>click-me</button>
        </div>
      )
    }
    const result: RenderResult = render(<TestComponent/>)
    expect(result.getByText("foo")).toBeInTheDocument()
    fireEvent.click(result.getByText("click-me"))
    expect(result.getByText("bar")).toBeInTheDocument()
  })
  
  test("useStateSafely as array works", () => {
    const TestComponent: FC = () => {
      const [ value, setValue ] = useStateSafely("foo").asArray()
      return (
        <div>
          <p>{value}</p>
          <button onClick={() => setValue("bar")}>click-me</button>
        </div>
      )
    }
    const result: RenderResult = render(<TestComponent/>)
    expect(result.getByText("foo")).toBeInTheDocument()
    fireEvent.click(result.getByText("click-me"))
    expect(result.getByText("bar")).toBeInTheDocument()
  })
})

test("StateHolder works", () => {
  const value = ""
  const setValue: SetState<string> = noop
  
  const sh = new StateHolder(value, setValue)
  const array = sh.asArray()
  expect(array[0]).toBe(sh.value)
  expect(array[1]).toBe(sh.setValue)
})