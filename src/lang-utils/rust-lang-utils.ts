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

export type OptionValue<T> = Some<T> | None

export class Some<T extends {}>  {
  readonly kind = "some"
  readonly value: T
  toString = () => { return `Some(${anyToString(this.value)})` }
  isSome: true
  isNone: false

  constructor(value: T) {
    this.value = value
    this.isSome = true
    this.isNone = false
  }
}

export class None {
  readonly kind = "none"
  toString = () => "None"
  readonly isSome = false
  readonly isNone = true
}

// Factory to create Option typed values.
export class Option {
  static none = (): None =>
    Object.freeze(new None())

  static some = <T extends {}>(arg: T): Some<T> =>
    Object.freeze(new Some(arg))

  static create = <T>(arg: Optional<T>): OptionValue<T> =>
    arg === undefined || arg === null ? Option.none() : Option.some(arg)
}

// Expressions that work w/ Option.

export const _callIfSome = <T>(
  ctxObject: OptionValue<T>,
  receiverFn: TruthyReceiverFn<T>
): void => {
  if (ctxObject.kind === "some") receiverFn(ctxObject.value)
}

export const _callIfNone = <T>(
  ctxObject: OptionValue<T>,
  receiverFn: SimpleReceiverFn
): void => {
  if (ctxObject.kind === "none") receiverFn()
}
