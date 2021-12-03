import { _repeat, createCache } from "../index"

describe("Cache", () => {
  test("can create a Cache", () => {
    const cache = createCache("test", 3, "least-frequently-used")
    expect(cache).toBeTruthy()
    expect(cache.name).toEqual("test")
    expect(cache.maxSize).toEqual(3)
    expect(cache.evictionPolicy).toEqual("least-frequently-used")
    expect(cache.size).toBe(0)
  })

  test("can put into & get from Cache", () => {
    let populateFn = (arg: string): string => arg + "_test"
    const cache = createCache<string, string>("test", 2, "least-frequently-used")

    // Cache miss for "foo" -> insert.
    expect(cache.get("foo", populateFn)).toEqual("foo_test")
    expect(cache.size).toEqual(1)
    expect(cache.contains("foo")).toBeTruthy()

    // Cache miss for "bar" -> insert.
    expect(cache.get("bar", populateFn)).toEqual("bar_test")
    expect(cache.size).toEqual(2)
    expect(cache.contains("bar")).toBeTruthy()

    // Cache hit for "foo"!
    expect(cache.get("foo", populateFn)).toEqual("foo_test")
    expect(cache.size).toEqual(2)
    expect(cache.contains("foo")).toBeTruthy()

    // Cache hit for "bar"!
    expect(cache.get("bar", populateFn)).toEqual("bar_test")
    expect(cache.size).toEqual(2)
    expect(cache.contains("bar")).toBeTruthy()
  })

  test("Cache eviction policy least-recently-used works", () => {
    let populateFn = (arg: string): string => arg + "_test"
    const cache = createCache<string, string>("test", 2, "least-recently-used")

    cache.get("foo", populateFn)
    cache.get("bar", populateFn)
    cache.get("baz", populateFn)

    expect(cache.size).toEqual(2)
    expect(cache.contains("foo")).toBeFalsy()
    expect(cache.contains("bar")).toBeTruthy()
    expect(cache.contains("baz")).toBeTruthy()
  })

  test("Cache eviction policy least-frequently-used works", () => {
    let populateFn = (arg: string): string => arg + "_test"
    const cache = createCache<string, string>("test", 2, "least-frequently-used")

    _repeat(3, () => cache.get("foo", populateFn))
    _repeat(2, () => cache.get("bar", populateFn))
    cache.get("baz", populateFn)

    expect(cache.size).toEqual(2)
    expect(cache.contains("foo")).toBeTruthy()
    expect(cache.contains("bar")).toBeTruthy()
    expect(cache.contains("baz")).toBeFalsy()
  })
})
