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

// noinspection JSVoidFunctionReturnValueUsed

import {
  _also,
  _apply,
  _let,
  _with,
  ImplicitReceiverObject,
  ImplicitReceiverObjectWithReturn,
  ReceiverFn,
  ReceiverFnWithReturn,
} from "../index"

it("_also() takes a contextObject, passes it to the ReceiverFn, and returns the contextObject", () => {
  const contextObject: string = "_also"

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
})

it("_let() takes a contextObject, passes it to the ReceiverFnWithReturn, and returns its return value", () => {
  const contextObject: string = "_let"
  const receiverFnReturnValue: Symbol = Symbol()

  // https://jasmine.github.io/2.1/introduction#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
  const myReceiverFn: ReceiverFnWithReturn<string, Symbol> = (it) => {
    expect(it).toEqual(contextObject)
    return receiverFnReturnValue
  }
  const spyObjectContainingFn = { myReceiverFn }
  spyOn(spyObjectContainingFn, "myReceiverFn").and.callThrough()

  const returnValue = _let(contextObject, spyObjectContainingFn.myReceiverFn)
  expect(returnValue).toEqual(receiverFnReturnValue)
  expect(spyObjectContainingFn.myReceiverFn).toHaveBeenCalled()
})

it(
  "_apply() takes a contextObject, binds it to ImplicitReceiverObject's this, calls it, then" +
    " returns the contextObject",
  () => {
    const contextObject: string = "_apply"

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
    const contextObject: string = "_with"
    const receiverReturnValue: Symbol = Symbol()

    // https://jasmine.github.io/2.1/introduction#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
    const myImplicitReceiverObjectWithReturn: ImplicitReceiverObjectWithReturn<string, Symbol> = {
      fnWithReboundThis: function (): Symbol {
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
