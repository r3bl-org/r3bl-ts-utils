import { Optional } from "./core"
import { TruthyReceiverFn, SimpleReceiverFn } from "./expression-lang-utils"

// Option is based on Rust's Option enum and it is intended to be used in place of null and
// undefined. Expressing !undefined && !null in TS: https://stackoverflow.com/a/63046469/2085356

export type Option<T extends {}> = Some<T> | None
export type Some<T extends {}> = { kind: "some", value: T }
export type None = { kind: "none" }

// Factory to create Option typed values.
export class OptionValue {
  static createNone(): None {
    return { kind: "none" }
  }

  static createSome<T extends {}>(arg: T): Some<T> {
    return { kind: "some", value: arg }
  }

  static create<T>(arg: Optional<T>): Option<T> {
    return arg === undefined || arg === null ?
      OptionValue.createNone() :
      OptionValue.createSome(arg)
  }
}

// Expressions that work w/ Option.

export const _callIfSome = <T>(
  ctxObject: Option<T>,
  receiverFn: TruthyReceiverFn<T>
): Option<T> => {
  if (ctxObject.kind === "some")
    receiverFn(ctxObject.value)
  return ctxObject
}

export const _callIfNone = <T>(
  ctxObject: Option<T>,
  receiverFn: SimpleReceiverFn
): Option<T> => {
  if (ctxObject.kind === "none")
    receiverFn()
  return ctxObject
}
