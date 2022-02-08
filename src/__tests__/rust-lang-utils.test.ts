import { None, Option, Some } from "../index"
import { _callIfNone, _callIfSome } from "../lang-utils"
import { Flag } from "./test-helpers"

test("How it is used by a consumer of the library, ergonomics check", () => {
  let optionalValue: Option<string>

  optionalValue = Option.create("some_value") // same as Option.some("some_value").
  if (optionalValue.isSome()) {
    expect(optionalValue).toBeInstanceOf(Some)
    expect(optionalValue.value).toBe("some_value")
  }

  optionalValue = Option.create<string>(undefined) // Same as Option.none().
  expect(optionalValue.isSome()).toBe(false)
  if (optionalValue.isNone()) {
    expect(optionalValue).toBeInstanceOf(None)
  }
})

test("Option Some and None can be created directly", () => {
  const some: Some<string> = Option.some<string>("some_value")
  const none: None<string> = Option.none<string>()
  checkSome(some)
  checkNone(none)
})

test("Option can be created", () => {
  const some: Option<string> = Option.create<string>("some_value")
  const none: Option<string> = Option.create<string>(undefined)
  checkOption(some)
  checkOption(none)
})

function checkOption<T>(option: Option<T>) {
  if (option.isSome()) return checkSome(option)
  if (option.isNone()) return checkNone(option)
}

function checkSome<T>(some: Some<T>) {
  expect(some).toBeInstanceOf(Some)
  expect(some.value).toBe("some_value")
  expect(some.isSome()).toBe(true)
  expect(some.isNone()).toBe(false)
  expect(some instanceof Some).toBe(true)
  expect(some instanceof None).toBe(false)
}

function checkNone<T>(none: None<T>) {
  expect(none).toBeInstanceOf(None)
}

test("callIfSome works", () => {
  const flag = new Flag()

  _callIfSome(Option.some("some_value"), flag.set)
  expect(flag.isSet()).toBe(true)
  expect(flag.args).toEqual(["some_value"])
})

test("callIfNone works", () => {
  const flag = new Flag()

  _callIfNone(Option.none(), flag.set)
  expect(flag.isSet()).toBe(true)
})
