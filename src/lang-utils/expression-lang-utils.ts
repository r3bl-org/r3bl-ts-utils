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

import { Optional } from "./core"

/**
 * https://developer.mozilla.org/en-US/docs/Glossary/Truthy
 * @param ctxObject it can be null or undefined
 * @param receiverFn lambda that accepts `it`; only runs if `ctxObject` property is truthy
 * @return ctxObject the first argument
 */
export const _callIfTruthy = <T>(
  ctxObject: Optional<T>,
  receiverFn: TruthyReceiverFn<T>
): Optional<T> => {
  if (ctxObject) receiverFn(ctxObject)
  return ctxObject
}
export type TruthyReceiverFn<T> = (it: T) => void

export const _callIfTruthyWithReturn = <T, R>(
  ctxObject: Optional<T>,
  onTrue: TruthyReceiverWithReturnValueFn<T, R>,
  onFalse: SimpleReceiverWithReturnValueFn<R>
): R => {
  if (ctxObject) return onTrue(ctxObject)
  return onFalse()
}
export type TruthyReceiverWithReturnValueFn<T, R> = (it: T) => R

/**
 * https://developer.mozilla.org/en-US/docs/Glossary/Falsy
 * @param ctxObject it can be null or undefined
 * @param receiverFn lambda that only runs if `ctxObject` property is falsy
 */
export const _callIfFalsy = (ctxObject: unknown, receiverFn: FalsyReceiverFn) =>
  !ctxObject ? receiverFn() : undefined

export type FalsyReceiverFn = () => void

export const _repeat = (count: number, fun: () => void): void => {
  for (let i = 0; i < count; i++) fun()
}

export const _callIfTrue = (
  ctxObject: boolean,
  onTrueReceiverFn: SimpleReceiverFn,
  onFalseReceiverFn?: SimpleReceiverFn
): void => {
  if (ctxObject) onTrueReceiverFn()
  else onFalseReceiverFn ? onFalseReceiverFn() : undefined
}
export const _callIfFalse = (
  ctxObject: boolean,
  onFalseReceiverFn: SimpleReceiverFn,
  onTrueReceiverFn?: SimpleReceiverFn
): void => {
  if (!ctxObject) onFalseReceiverFn()
  else onTrueReceiverFn ? onTrueReceiverFn() : undefined
}
export type SimpleReceiverFn = () => void

export const _callIfTrueWithReturn = <T>(
  ctxObject: boolean,
  onTrueReceiverFn: SimpleReceiverWithReturnValueFn<T>,
  onFalseReceiverFn: SimpleReceiverWithReturnValueFn<T>
): T => {
  if (ctxObject) return onTrueReceiverFn()
  return onFalseReceiverFn()
}
export type SimpleReceiverWithReturnValueFn<T> = () => T

