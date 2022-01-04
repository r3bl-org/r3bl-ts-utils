/*
 * Copyright 2022 R3BL LLC. All rights reserved.
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

import {
  _also, _callIfFalse, _callIfFalsy, _callIfTrue, _callIfTrueWithReturn, _callIfTruthy,
  _callIfTruthyWithReturn, _repeat
} from "../index"

describe("misc-utils", () => {
  test("_callIfTruthy(condition, fun)", () => {
    type CtxObjType = { foo: number }
    const contextObject: CtxObjType | undefined = { foo: 1 }
    
    let executed = false
    const returnValue = _callIfTruthy(contextObject, (it: CtxObjType) => {
      expect(it).toBeDefined()
      expect(it).toEqual({ foo: 1 })
      executed = true
    })
    expect(returnValue).toBeTruthy()
    expect(returnValue).toBe(contextObject)
    expect(executed).toBeTruthy()
  })
  
  test("_callIfFalsy(condition, fun)", () => {
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
  
  test("_repeat(count, fun)", () => {
    let count = 0
    _repeat(5, () => count++)
    expect(count).toEqual(5)
  })
  
  test("_callIfTrue(condition, fun)", () => {
    let flag = false
    const fun = () => {
      flag = true
    }
    _callIfTrue(false, fun)
    expect(flag).toBeFalsy()
    _callIfTrue(true, fun)
    expect(flag).toBeTruthy()
  })
  
  test("_callIfTrue(condition, onTrueFun, onFalseFun)", () => {
    type Flags = { onTrueFlag: boolean; onFalseFlag: boolean }
    const onTrueFn = (flags: Flags) => flags.onTrueFlag = true
    const onFalseFn = (flags: Flags) => flags.onFalseFlag = true
    
    _also({
      onTrueFlag: false,
      onFalseFlag: false
    }, it => {
      _callIfTrue(false, onTrueFn.bind(undefined, it), onFalseFn.bind(undefined, it))
      expect(it.onTrueFlag).toBeFalsy()
      expect(it.onFalseFlag).toBeTruthy()
    })
    
    _also({
      onTrueFlag: false,
      onFalseFlag: false
    }, it => {
      _callIfFalse(false, onFalseFn.bind(undefined, it), onTrueFn.bind(undefined, it))
      expect(it.onTrueFlag).toBeFalsy()
      expect(it.onFalseFlag).toBeTruthy()
    })
  })
  
  test("_callIfFalse(condition, onTrueFun, onFalseFun)", () => {
    let flag = true
    const fun = () => {
      flag = false
    }
    _callIfFalse(true, fun)
    expect(flag).toBeTruthy()
    _callIfFalse(false, fun)
    expect(flag).toBeFalsy()
  })
  
  test("_callIfTruthyWithReturn(condition, onTrueFunWithReturn, onFalseFunWithReturn)", () => {
    // Condition is truthy.
    _also({
      onTrueFlag: false,
      onFalseFlag: false
    }, flags => {
      const returnValue = _callIfTruthyWithReturn(
        "foo",
        (it) => {
          expect(it).toEqual("foo")
          flags.onTrueFlag = true
          return "true"
        },
        () => {
          flags.onFalseFlag = false
          return "false"
        }
      )
      expect(returnValue).toEqual("true")
      expect(flags.onTrueFlag).toBeTruthy()
      expect(flags.onFalseFlag).toBeFalsy()
    })
    
    // Condition is falsy.
    _also({
      onTrueFlag: false,
      onFalseFlag: false
    }, flags => {
      const returnValue = _callIfTruthyWithReturn(
        undefined,
        (it) => {
          expect(it).toBeFalsy()
          flags.onTrueFlag = false
          return "true"
        },
        () => {
          flags.onFalseFlag = true
          return "false"
        }
      )
      expect(returnValue).toEqual("false")
      expect(flags.onTrueFlag).toBeFalsy()
      expect(flags.onFalseFlag).toBeTruthy()
    })
  })
  
  test("_callIfTrueWithReturn(condition, onTrueFunWithReturn, onFalseFunWithReturn)", () => {
    // Condition is true.
    _also({
      onTrueFlag: false,
      onFalseFlag: false
    }, flags => {
      const returnValue = _callIfTrueWithReturn(
        true,
        () => {
          flags.onTrueFlag = true
          return "true"
        },
        () => {
          flags.onFalseFlag = false
          return "false"
        }
      )
      expect(returnValue).toEqual("true")
      expect(flags.onTrueFlag).toBeTruthy()
      expect(flags.onFalseFlag).toBeFalsy()
    })
    
    // Condition is false.
    _also({
      onTrueFlag: false,
      onFalseFlag: false
    }, flags => {
      const returnValue = _callIfTrueWithReturn(
        false,
        () => {
          flags.onTrueFlag = false
          return "true"
        },
        () => {
          flags.onFalseFlag = true
          return "false"
        }
      )
      expect(returnValue).toEqual("false")
      expect(flags.onTrueFlag).toBeFalsy()
      expect(flags.onFalseFlag).toBeTruthy()
    })
  })
})
