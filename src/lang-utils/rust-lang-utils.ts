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

export abstract class Option<T> {
  readonly _isSome: boolean

  constructor(value: T | undefined | null) {
    if (value === undefined || value === null) {
      this._isSome = false
    } else {
      this._isSome = true
    }
  }

  // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
  isSome(): this is Some<T> {
    return this._isSome
  }

  // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
  isNone(): this is None<T> {
    return !this._isSome
  }

  abstract toString(): string

  static none = <T>(): None<T> => Object.freeze(new None<T>())

  static some = <T extends {}>(arg: T): Some<T> => Object.freeze(new Some<T>(arg))

  static create = <T>(arg: Optional<T>): Option<T> =>
    arg === undefined || arg === null ? Option.none() : Option.some(arg)
}

export class None<T> extends Option<T> {
  constructor() {
    super(undefined)
  }

  public toString(): string {
    return `None`
  }
}

export class Some<T extends {}> extends Option<T> {
  readonly _value: T

  constructor(value: T) {
    super(value)
    this._value = value
  }

  public toString(): string {
    return `Some(${anyToString(this.value)})`
  }

  public get value(): T {
    return this._value
  }
}

// Expressions that work w/ Option.

export const _callIfSome = <T>(context: Option<T>, receiver: TruthyReceiverFn<T>): void => {
  if (context instanceof Some) receiver(context.value)
}

export const _callIfNone = <T>(context: Option<T>, receiver: SimpleReceiverFn): void => {
  if (context instanceof None) receiver()
}
