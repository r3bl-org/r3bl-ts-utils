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

import {
  _also, _alsoAsync, _apply, _let, _then, _with, ImplicitReceiverObject,
  ImplicitReceiverObjectWithReturn, ReceiverFn, ReceiverFnAsync, ReceiverFnWithReturn,
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
    
    // https://jasmine.github.io/2.1/introduction#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
    const myReceiverFn: ReceiverFn<string> = (it) => {
      expect(it).toEqual(contextObject)
      return it
    }
    const spyObjectContainingFn = { myReceiverFn }
    spyOn(spyObjectContainingFn, "myReceiverFn").and.callThrough()
    
    const returnValue = _also(contextObject, spyObjectContainingFn.myReceiverFn)
    expect(returnValue).toEqual(contextObject)
    expect(spyObjectContainingFn.myReceiverFn).toHaveBeenCalled()
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
  "_let() takes a contextObject, passes it to the ReceiverFnWithReturn, and returns its return value",
  () => {
    const contextObject = "_let"
    const receiverFnReturnValue = Symbol()
    
    // https://jasmine.github.io/2.1/introduction#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
    const myReceiverFn: ReceiverFnWithReturn<string, symbol> = (it) => {
      expect(it).toEqual(contextObject)
      return receiverFnReturnValue
    }
    const spyObjectContainingFn = { myReceiverFn }
    spyOn(spyObjectContainingFn, "myReceiverFn").and.callThrough()
    
    const returnValue = _let(contextObject, spyObjectContainingFn.myReceiverFn)
    expect(returnValue).toEqual(receiverFnReturnValue)
    expect(spyObjectContainingFn.myReceiverFn).toHaveBeenCalled()
  }
)

it(
  "_apply() takes a contextObject, binds it to ImplicitReceiverObject's this, calls it, then" +
  " returns the contextObject",
  () => {
    const contextObject = "_apply"
    
    // https://jasmine.github.io/2.1/introduction#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
    const myImplicitReceiverObject: ImplicitReceiverObject<string> = {
      fnWithReboundThis: function (): string {
        expect(this).toEqual(contextObject)
        return contextObject
      },
    }
    spyOn(myImplicitReceiverObject, "fnWithReboundThis").and.callThrough()
    
    const returnValue = _apply(contextObject, myImplicitReceiverObject)
    expect(returnValue).toEqual(contextObject)
    expect(myImplicitReceiverObject.fnWithReboundThis).toHaveBeenCalled()
  }
)

it(
  "_with() takes a contextObject, binds it to ImplicitReceiverObjectWithReturn's this, calls it," +
  " then returns the its return value",
  () => {
    const contextObject = "_with"
    const receiverReturnValue = Symbol()
    
    // https://jasmine.github.io/2.1/introduction#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
    const myImplicitReceiverObjectWithReturn: ImplicitReceiverObjectWithReturn<string, symbol> = {
      fnWithReboundThis: function (): symbol {
        expect(this).toEqual(contextObject)
        return receiverReturnValue
      },
    }
    spyOn(myImplicitReceiverObjectWithReturn, "fnWithReboundThis").and.callThrough()
    
    const returnValue = _with(contextObject, myImplicitReceiverObjectWithReturn)
    expect(returnValue).toEqual(receiverReturnValue)
    expect(myImplicitReceiverObjectWithReturn.fnWithReboundThis).toHaveBeenCalled()
  }
)
