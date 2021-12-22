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

import { _callIfFalse, _callIfFalsy, _callIfTrue, _callIfTruthy, _repeat } from "../misc-utils"

describe("misc-utils", () => {
  test("_callIfTruthy", () => {
    let executed = false
    const ctxObject = _callIfTruthy(true, (it) => {
      expect(it).toBeTruthy()
      executed = true
    })
    expect(ctxObject).toBeTruthy()
    expect(executed).toBeTruthy()
  })
  
  test("_callIfFalsy", () => {
    let executedIfNull = false
    let executedIfUndefined = false
    
    _callIfFalsy(undefined, () => {
      executedIfUndefined = true
    })
    _callIfFalsy(null, () => {
      executedIfNull = true
    })
    
    expect(executedIfUndefined).toBeTruthy()
    expect(executedIfNull).toBeTruthy()
  })
  
  test("_repeat", () => {
    let count = 0
    _repeat(5, () => count++)
    expect(count).toEqual(5)
  })
  
  test("_callIfTrue", () => {
    let flag = false
    const fun = () => {
      flag = true
    }
    _callIfTrue(false, fun)
    expect(flag).toBeFalsy()
    _callIfTrue(true, fun)
    expect(flag).toBeTruthy()
  })
  
  test("_callIfFalse", () => {
    let flag = true
    const fun = () => {
      flag = false
    }
    _callIfFalse(true, fun)
    expect(flag).toBeTruthy()
    _callIfFalse(false, fun)
    expect(flag).toBeFalsy()
  })
})
