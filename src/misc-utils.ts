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

import { ColorConsole, Styles } from "./color-console-utils/color-console"

export const sleep = (ms = 500) => {
  const sprites = ["-", "\\", "-", "/"]

  let count = 0
  const printDotsInterval = setInterval(() => {
    const sprite: string = sprites[count++ % sprites.length]?.toString() ?? ""
    ColorConsole.create(Styles.Primary)("Sleep " + sprite).consoleLogInPlace()
  }, 100)

  return new Promise<void>((resolveFn) => {
    setTimeout(() => {
      clearInterval(printDotsInterval)
      console.log()
      resolveFn()
    }, ms)
  })
}

/**
 * @param ctxObject it can be null or undefined
 * @param receiverFn lambda that accepts `it`; only runs if `ctxObject` property is truthy
 * @return ctxObject the first argument
 */
export const _callIfTruthy = <T>(
  ctxObject: Nullable<T>,
  receiverFn: TruthyReceiverFn<T>
): Nullable<T> => {
  if (ctxObject) receiverFn(ctxObject)
  return ctxObject
}
export type Nullable<T> = T | null | undefined
export type TruthyReceiverFn<T> = (it: T) => void

/**
 * @param ctxObject it can be null or undefined
 * @param receiverFn lambda that only runs if `ctxObject` property is falsy
 */
export const _callIfFalsy = (ctxObject: unknown, receiverFn: FalsyReceiverFn) =>
  !ctxObject ? receiverFn() : undefined

export type FalsyReceiverFn = () => void

export const _repeat = (count: number, fun: () => void): void => {
  for (let i = 0; i < count; i++) fun()
}

export const _callIfTrue = (ctxObject: boolean, receiverFn: SimpleReceiverFn): void => {
  if (ctxObject) receiverFn()
}
export const _callIfFalse = (ctxObject: boolean, receiverFn: SimpleReceiverFn): void => {
  if (!ctxObject) receiverFn()
}
export type SimpleReceiverFn = () => void
