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

import {
  _also, _alsoAsync, _alsoSafe, _alsoSafeAsync, _apply, _let, _letSafe, _then, _with,
  ImplicitReceiverObject, ImplicitReceiverObjectWithReturn, ReceiverFn, ReceiverFnAsync,
} from "../index"

it(
  "_then() takes a contextObject, passes it to the ReceiverFn[], and returns the contextObject",
  () => {
    const contextObject = "_then"
    
    const flags = [ false, false ]
    const fun1: ReceiverFn<string> = (it) => {
      expect(it).toEqual(contextObject)
      flags[0] = true
    }
    const fun2: ReceiverFn<string> = (it) => {
      expect(it).toEqual(contextObject)
      flags[1] = true
    }
    
    const returnValue = _then(contextObject, fun1, fun2)
    expect(returnValue).toEqual(contextObject)
    expect(flags[0]).toBeTruthy()
    expect(flags[1]).toBeTruthy()
  }
)

it(
  "_also() takes a contextObject, passes it to the ReceiverFn, and returns the contextObject",
  () => {
    const contextObject = "_also"
    let flag = false
    const returnValue = _also(contextObject, it => {
      expect(it).toBe(contextObject)
      flag = true
    })
    expect(returnValue).toEqual(contextObject)
    expect(flag).toBeTruthy()
  }
)

it(
  "_alsoSafe() takes a contextObject, passes a deep copy of it to the ReceiverFn, and returns the copy",
  () => {
    const contextObject = { foo: 1 }
    
    let flag = false
    const fun: ReceiverFn<typeof contextObject> = (it: typeof contextObject): void => {
      expect(it).not.toBe(contextObject)
      flag = true
    }
    
    const returnValue = _alsoSafe(contextObject, fun)
    
    expect(returnValue).not.toBe(contextObject)
    expect(returnValue).toEqual(contextObject)
    expect(flag).toBeTruthy()
  }
)

it(
  "_alsoAsync() takes a contextObject, passes it to the ReceiverFnAsync, and returns it and" +
  " promise from ReceiverFnAsync",
  async () => {
    const contextObject = "_alsoAsync"
    
    let flag = false
    
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
    const fun1: ReceiverFnAsync<string, boolean> = async (it) =>
      new Promise<boolean>((resolveFn) => {
        const _fun = () => {
          expect(it).toEqual(contextObject)
          flag = true
          resolveFn(true)
        }
        // Delay execution of _fun to next iteration of event loop.
        // https://nodejs.dev/learn/understanding-setimmediate
        setImmediate(_fun)
      })
    
    const { contextObject: obj, promiseFromReceiverFn: promise } = _alsoAsync(contextObject, fun1)
    
    expect(obj).toEqual(contextObject)
    expect(flag).toBeFalsy()
    
    const value = await promise
    expect(value).toBeTruthy()
    expect(flag).toBeTruthy()
  }
)

it(
  "_alsoSafeAsync() takes a contextObject, passes a deep copy of it to the ReceiverFnAsync," +
  " and returns the deep copy and the promise from ReceiverFnAsync",
  async () => {
    const contextObject = { foo: 1 }
    
    let flag = false
    
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
    const fun1: ReceiverFnAsync<typeof contextObject, boolean> = async (it) =>
      new Promise<boolean>((resolveFn) => {
        const _fun = () => {
          expect(it).toEqual(contextObject)
          expect(it).not.toBe(contextObject)
          flag = true
          resolveFn(true)
        }
        // Delay execution of _fun to next iteration of event loop.
        // https://nodejs.dev/learn/understanding-setimmediate
        setImmediate(_fun)
      })
    
    const { contextObjectDeepCopy: obj, promiseFromReceiverFn: promise } = _alsoSafeAsync(
      contextObject,
      fun1
    )
    
    expect(obj).toEqual(contextObject)
    expect(flag).toBeFalsy()
    
    const value = await promise
    expect(value).toBeTruthy()
    expect(flag).toBeTruthy()
  }
)

it(
  "_let() takes a contextObject, passes it to the ReceiverFnWithReturn, and returns its return value",
  () => {
    const contextObject = "_let"
    let flag = false
    const returnValue = _let(contextObject, it => {
      expect(contextObject).toBe(it)
      flag = true
      return "foo"
    })
    expect(returnValue).toEqual("foo")
    expect(flag).toBeTruthy()
  }
)

it(
  "_letSafe() takes a contextObject, passes a deep copy of it to the ReceiverFnWithReturn, and" +
  " returns its return value",
  () => {
    const contextObject = { foo: 1 }
    let flag = false
    const returnValue = _letSafe(contextObject, it => {
      expect(it).toEqual(contextObject)
      expect(it).not.toBe(contextObject)
      flag = true
      return "foo"
    })
    expect(returnValue).toEqual("foo")
    expect(flag).toBeTruthy()
  }
)

it(
  "_apply() takes a contextObject, binds it to ImplicitReceiverObject's this, calls it, then" +
  " returns the contextObject",
  () => {
    const contextObject = "_apply"
    let flag = false
    const myImplicitReceiverObject: ImplicitReceiverObject<string> = {
      fnWithReboundThis: function (): string {
        expect(this).toEqual(contextObject)
        flag = true
        return contextObject
      }
    }
    const returnValue = _apply(contextObject, myImplicitReceiverObject)
    expect(returnValue).toEqual(contextObject)
    expect(flag).toBeTruthy()
  }
)

it(
  "_with() takes a contextObject, binds it to ImplicitReceiverObjectWithReturn's this, calls it," +
  " then returns the its return value",
  () => {
    const contextObject = "_with"
    let flag = false
    const myImplicitReceiverObjectWithReturn: ImplicitReceiverObjectWithReturn<string, string> = {
      fnWithReboundThis: function (): string {
        expect(this).toEqual(contextObject)
        flag = true
        return "foo"
      },
    }
    const returnValue = _with(contextObject, myImplicitReceiverObjectWithReturn)
    expect(returnValue).toEqual("foo")
    expect(flag).toBeTruthy()
  }
)
