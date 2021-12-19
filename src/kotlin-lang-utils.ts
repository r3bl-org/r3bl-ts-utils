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

/*
 * These functions are inspired by Kotlin scoping functions (with, apply, let, run, etc).
 * https://kotlinlang.org/docs/scope-functions.html#function-selection
 *
 * Kotlin context and `this` rebinding.
 * https://developerlife.com/2020/04/05/kotlin-dsl-intro/#context-and-rebinding-this
 *
 * TypeScript and handling `this` explicitly
 * https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters
 * https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype
 * https://stackoverflow.com/a/50567437/2085356
 *
 * JavaScript `bind` and `call`
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 *
 * TypeScript JSDocs.
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
 */

export type ReceiverFn<T> = (it: T) => void
export type ReceiverFnWithReturn<T, R> = (it: T) => R
export type ReceiverFnAsync<T, R> = (it: T) => Promise<R>

/**
 * @param contextObject value of `it`
 * @param receiverFns array of lambdas that accepts `it`
 * @return contextObject that is passed
 */
export const _then = <T>(contextObject: T, ...receiverFns: ReceiverFn<T>[]): T => {
  receiverFns.forEach((fun) => fun(contextObject))
  return contextObject
}

/**
 * @param contextObject value of `it`
 * @param receiverFn lambda that accepts `it`
 * @return contextObject that is passed
 */
export const _also = <T>(contextObject: T, receiverFn: ReceiverFn<T>): T => {
  receiverFn(contextObject)
  return contextObject
}

/**
 * @param contextObject value of `it`
 * @param receiverFn lambda that accepts `it`
 * @return {contextObject that is passed, promise returned by receiverFn}
 */
export const _alsoAsync = <T, R>(
  contextObject: T,
  receiverFn: ReceiverFnAsync<T, R>
): { contextObject: T; promiseFromReceiverFn: Promise<R> } => {
  const promiseFromReceiverFn = receiverFn(contextObject)
  return { contextObject, promiseFromReceiverFn }
}

/**
 * @param contextObject value of `it`
 * @param receiverFnWithReturn lambda that accepts `it`
 * @return result of the receiverFnWithReturn (lambda)
 */
export const _let = <T, R>(
  contextObject: T,
  receiverFnWithReturn: ReceiverFnWithReturn<T, R>
): R => {
  return receiverFnWithReturn(contextObject)
}

export interface ImplicitReceiverObject<T> {
  fnWithReboundThis: (this: T) => void
}

export interface ImplicitReceiverObjectWithReturn<T, R> {
  fnWithReboundThis: (this: T) => R
}

/**
 * @param contextObject value of `this` (in the `blockWithReboundThis` function)
 * @param objectContainingFnWithReboundThis object containing function `blockWithReboundThis`
 *        which accepts contextObject (aka `this`)
 * @return contextObject that is passed
 */
export const _apply = <T>(
  contextObject: T,
  objectContainingFnWithReboundThis: ImplicitReceiverObject<T>
): T => {
  objectContainingFnWithReboundThis.fnWithReboundThis.bind(contextObject).call(contextObject)
  return contextObject
}

/**
 * @param contextObject value of `this` (in the `blockWithReboundThis` function)
 * @param objectContainingFnWithReboundThis object containing function `blockWithReboundThis`
 *        which accepts contextObject (aka `this`)
 * @return result of the `blockWithReboundThis` function
 */
export const _with = <T, R>(
  contextObject: T,
  objectContainingFnWithReboundThis: ImplicitReceiverObjectWithReturn<T, R>
): R => objectContainingFnWithReboundThis.fnWithReboundThis.bind(contextObject).call(contextObject)

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

export function isNotDefined<T>(value: T | undefined | null): value is null | undefined {
  return value === undefined || value === null
}

export const notNil = <T>(condition: null | undefined | T, receiverFn: ReceiverFn<T>): void => {
  isDefined(condition) ? receiverFn(condition) : null
}

export type Optional<T> = T | undefined | null
