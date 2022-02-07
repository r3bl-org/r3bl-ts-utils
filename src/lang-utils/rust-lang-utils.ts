/*
 Copyright 2022 R3BL LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

import { Optional } from "./core"
import { anyToString } from "./data-class"
import { SimpleReceiverFn, TruthyReceiverFn } from "./expression-lang-utils"

// Option is based on Rust's Option enum and it is intended to be used in place of null and
// undefined. Expressing !undefined && !null in TS: https://stackoverflow.com/a/63046469/2085356

export type OptionType<T extends {}> = Some<T> | None
export type Some<T extends {}> = {
  kind: "some",
  value: T,
  toString: () => string,
  isSome: true,
  isNone: false,
}
export type None = {
  kind: "none"
  toString: () => string,
  isSome: false,
  isNone: true,
}

// Factory to create Option typed values.
export namespace Option {
  export function none(): None {
    return Object.freeze({
      kind: "none",
      toString: () => "none",
      isSome: false,
      isNone: true,
    })
  }

  export function some<T extends {}>(arg: T): Some<T> {
    return Object.freeze({
      kind: "some",
      value: arg,
      toString: () => anyToString(arg),
      isSome: true,
      isNone: false,
    })
  }

  export function create<T>(arg: Optional<T>): OptionType<T> {
    return arg === undefined || arg === null ?
      Option.none() :
      Option.some(arg)
  }
}

// Expressions that work w/ Option.

export const _callIfSome = <T>(
  ctxObject: OptionType<T>,
  receiverFn: TruthyReceiverFn<T>
): void => {
  if (ctxObject.kind === "some") receiverFn(ctxObject.value)
}

export const _callIfNone = <T>(
  ctxObject: OptionType<T>,
  receiverFn: SimpleReceiverFn
): void => {
  if (ctxObject.kind === "none") receiverFn()
}
