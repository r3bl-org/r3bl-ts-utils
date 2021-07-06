# r3bl-ts-utils npm package

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Overview](#overview)
- [Colorized console](#colorized-console)
- [Scope functions](#scope-functions)
  - [`_also`](#_also)
  - [`_let`](#_let)
  - [`_apply`](#_apply)
  - [`_with`](#_with)
- [Misc utils](#misc-utils)
- [Build, test, and publish this package](#build-test-and-publish-this-package)
  - [Build, format, test](#build-format-test)
  - [Publish to npm](#publish-to-npm)
  - [Bump a package version (patch)](#bump-a-package-version-patch)
- [IDEA configurations](#idea-configurations)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

The `r3bl-ts-utils` package is a set of useful TypeScript functions and classes that can be used in
Node.js and browser environments. The following groups of functionality are provided in this
package.

1. Powerful colorized console output inspired by the [color-console][o-3] library (written in
   Kotlin).
2. Scope functions inspired by [Kotlin stdlib scope functions][o-4] (`_also`, `_let`, `_apply`,
   `_with`).
3. Misc utilities, eg an async `sleep` function that makes introduce fancy formatted delays in your
   code.

To install the package, simply run the following in the top level folder of your project.

```shell
npm i r3bl-ts-utils
```

> For more information on how this package was created, or to facilitate a deep dive of the code
> written here, please read the [Node.js w/ TypeScript handbook][o-5] on developerlife.com.

Here are some important links for this package.

1. [Github repo][o-1]
2. [npm package][o-2]

[o-1]: https://github.com/r3bl-org/r3bl-ts-utils
[o-2]: https://www.npmjs.com/package/r3bl-ts-utils
[o-3]: https://github.com/nazmulidris/color-console
[o-4]: https://kotlinlang.org/docs/scope-functions.html
[o-5]: https://developerlife.com/2021/07/02/nodejs-typescript-handbook/

## Colorized console

Let's look at how to use this by example. You can browse the source [here][cc-1].

You can simply colorize existing `console.log` and `console.error`, like this using the default
styles that are provided in `Styles`.

```typescript
import { printHeader, Styles } from "r3bl-ts-utils"

printHeader(`Example 1`)
console.log(Styles.Primary(`Wrote file successfully. 👍`))
console.error(Styles.Secondary(`Failed to write file! ⛔`))
```

To override on the default styles, here's an example. The [`chalk`][cc-2] library is used under the
hood, so you can use all it's styling rules, objects, functions, and classes.

[cc-1]: https://github.com/r3bl-org/r3bl-ts-utils/blob/main/src/color-console-utils.ts
[cc-2]: https://www.npmjs.com/package/chalk

```typescript
import { printHeader, Styles } from "r3bl-ts-utils"

printHeader(`Example 2`)
console.log(Styles.Primary.blue(`Wrote file successfully. 👍`))
console.error(Styles.Secondary.red.bgBlack(`Failed to write file! ⛔`))
```

Here's how you can use the `ColorConsole` class to do more powerful things.

```typescript
import { printHeader, Styles, ColorConsole } from "r3bl-ts-utils"

printHeader(`Example 3`)
const myColorConsole = ColorConsole.create(chalk.bold.yellow.bgBlack)
myColorConsole(/* text: */ `Start log output...`).consoleLog()

const count = 4
while (count-- > 0) {
  ColorConsole.create(Styles.Primary.red)(`While loop output: ${count}`).consoleLogInPlace()
}

ColorConsole.create(Styles.Primary.blue)(/* text: */ `End log output...`).consoleLog(
  /* prefixWithNewLine: */ true
)
```

> Note that once created, using `create()`, you can simply call that instance w/out passing a
> method. This happens because the `create()` factory method creates a new `ColorConsole` object,
> which also implements the `ColorConsoleIF` interface, which is callable) by providing a
> `(text: string)` signature that binds to the `call(text: string)` method.

If you don't deviate from the `Primary` and `Secondary` styles, then you can simply use some default
`ColorConsole` instances that have been created for you like this.

```typescript
import { printHeader, Styles, ColorConsole, StyledColorConsole } from "r3bl-ts-utils"
import * as _ from "lodash"

printHeader(`Example 4`)
const data = { foo: "foo_value", bar: "bar_value" }
for (const key in data) {
  StyledColorConsole.Primary(
    Styles.Primary(key) + " -> " + Styles.Secondary(_.get(data, key))
  ).consoleLog()
}
```

## Scope functions

The scope functions mimic Kotlin's `stdlib` scope functions (`also`, `let`, `apply`, `with`) one to
one. So here are four examples of using them. You can browse the source [here][sf-1].

> The [tests][sf-2] for this library are worth taking a look at to get a sense of how to use them.

[sf-1]: https://github.com/r3bl-org/r3bl-ts-utils/blob/main/src/kotlin-lang-utils.ts
[sf-2]: https://github.com/r3bl-org/r3bl-ts-utils/tree/main/src/__tests

### `_also`

[`_also()`][sf-1] takes a `contextObject`, passes it to the `ReceiverFn`, and returns the
`contextObject`. Here's an example.

```typescript
import { _also } from "r3bl-ts-utils"

const spans = _also(new Array<string>(3), (spans: string[]) => {
  spans[0] = "one"
  spans[1] = "two"
  spans[2] = "three"
})
const output = spans.join(", ")
console.log(output)
```

> You can name the argument to the `ReceiverFn` anything you like and not just `it` (which is the
> common practice in Kotlin).

### `_let`

[`_let()`][sf-1] takes a `contextObject`, passes it to the `ReceiverFnWithReturn`, and returns its
return value. Here's an example.

```typescript
import { _let } from "r3bl-ts-utils"

const contextObject = "string"
const returnValue = _let(contextObject, (it) => {
  return `my-${it}`
})
expect(returnValue).toEqual(`my-string`)
```

> The call to `_let(...)` returns the value of the 2nd argument `ReceiverFnWithReturn` and not the
> first argument `contextObject`.

### `_apply`

[`_apply()`][sf-1] takes a `contextObject`, binds it to `ImplicitReceiverObject`'s `this`, calls it,
then returns the `contextObject`. Here's an example.

```typescript
import { _apply, ImplicitReceiverObject } from "r3bl-ts-utils"

const contextObject: string = "string"
const myImplicitReceiverObject: ImplicitReceiverObject<string> = {
  fnWithReboundThis(): function (): string {
    expect(this).toEqual(contextObject)
    return contextObject
  },
}
const returnValue = _apply(contextObject, myImplicitReceiverObject)
expect(returnValue).toEqual(contextObject)
```

> In the code above, you can just inline the `myImplicitReceiverObject` into the line where you call
> `_apply()`. The code is written in this verbose way just for clarity.
>
> ⚠ Please note that the `fnWithReboundThis` can't be an arrow function, since it would not allow
> `this` to be rebound.

### `_with`

[`_with()`][sf-1] takes a `contextObject`, binds it to `ImplicitReceiverObjectWithReturn`'s `this`,
calls it then returns the its return value. Here's an example.

```typescript
import { _with, ImplicitReceiverObjectWithReturn } from "r3bl-ts-utils"

const contextObject: string = "some_data"
const hardcodedReceiverReturnValue: Symbol = Symbol()
const returnValue = _with(contextObject, {
  fnWithReboundThis: Symbol {
    expect(this).toEqual(contextObject)
    return hardcodedReceiverReturnValue
  },
})
expect(returnValue).toEqual(hardcodedReceiverReturnValue)
```

> In the code above, you can just inline the `myImplicitReceiverObjectWithReturn` into the line
> where you call `_with()`. The code is show in this verbose way just for clarity.
>
> ⚠ Please note that the `fnWithReboundThis` can't be an arrow function, since it would not allow
> `this` to be rebound.

## Misc utils

Let's look at how to use the only function included [here][mu-1] - `sleep()`. Here's an example of
it in action (in a Node.js program).

[mu-1]: https://github.com/r3bl-org/r3bl-ts-utils/blob/main/src/misc-utils.ts

```typescript
import { printHeader, sleep } from "r3bl-ts-utils"

const main = async (): Promise<void> => {
  printHeader(`Example 1 - spawn a child process to execute a command`)
  await new SpawnCProcToRunLinuxCommandAndGetOutput().run()
  await sleep(1000)

  printHeader(`Example 2 - pipe process.stdin into child process command`)
  await new SpawnCProcAndPipeStdinToLinuxCommand().run()
  await sleep(1000)

  printHeader(`Example 3 - pipe the output of one child process command into another one`)
  await new SpawnCProcToPipeOutputOfOneLinuxCommandIntoAnother().run()
  await sleep(1000)

  printHeader(`Example 4 - replace the functionality of a fish shell script`)
  await new SpawnCProcToReplaceFunctionalityOfFishScript().run()
  await sleep(1000)
}

main().catch(console.error)
```

## Build, test, and publish this package

The npm package contains the `build` and `src` folder contents. This is declared in the
`package.json` entry of `files`. There's an `.npmignore` file as well, which contains a list of
exclusions from the npm package, but that only contains the `.idea` folder (which is where JetBrains
IDEs store their project information).

Here are some good references for this:

- [`files` array in `package.json`][b-1] - The `files` array in `package.json` is bundled into the
  npm package by default.
- [Best practices for what to include in a npm package][b-2].

Additionally the `index.ts` just re-exports all the exports of the files that actually contain
useful source code. In this case, the exports from `kotlin-lang-utils.ts`, `color-console-utils.ts`,
and `misc-utils.ts` are all just re-exported by `index.ts`. This should make imports more manageable
for people who use this package. Also, users can simply import the whole thing into a namespace of
their choosing to prevent any collisions. For eg, it is possible to use this import statement to put
all the package symbols in a custom namespace like so.

```typescript
import * as mynamespace from "r3bl-ts-utils"

mynamespace.StyledColorConsole.Primary("log output").consoleLog()
mynamespace.sleep(1000)
```

Here are some good references for this:

- [Module re-exports][b-3]

[b-1]: https://npm.github.io/publishing-pkgs-docs/publishing/the-npmignore-file.html
[b-2]: https://stackoverflow.com/questions/43613124/should-i-publish-my-modules-source-code-on-npm
[b-3]: https://www.typescriptlang.org/docs/handbook/modules.html

### Build, format, test

Here are the basic scripts that need to be used during development.

- `npm run build` - Build the project.
- `npm run format` - Reformat the source code using `prettier`.
- `npm run test`- Run all the tests (using `jest`).

### Publish to npm

> ⚠ Make sure that you are logged into your npmjs.org account using `npm login` before publishing.

Run `npm publish` - This will publish your package to npm after running the following scripts.

1.  `npm run prepare` - This builds the package. It is run after the package is packed, published,
    and after its installed.
2.  `npm run prepublishOnly` - This runs all the tests in the package.

> Notes on `npm publish`.
>
> 1. You can pass `--dry-run` as an option to perform all the steps actually publishing it to npm.
>    The output from `npm publish --dry-run` is very useful as it will show you exactly which files
>    actually end up in your npm package. You can add or remove things to the [`.npmignore`][npm-2]
>    file based on what you see here.
> 2. Once a package is published w/ a given name and version, it can never be used again (even if
>    its removed w/ `npm unpublish`). This has to be done from the command line. You can learn more
>    about unpublishing a version or an entire package [here][npm-3].
> 3. More info on [`npm publish`][npm-1].

[npm-1]: https://docs.npmjs.com/cli/v7/commands/npm-publish
[npm-2]: https://github.com/r3bl-org/r3bl-ts-utils/blob/main/.npmignore
[npm-3]: https://docs.npmjs.com/unpublishing-packages-from-the-registry
[npm-4]: https://docs.npmjs.com/cli/v7/commands/npm-version

### Bump a package version (patch)

> ⚠ Make sure that you are logged into your npmjs.org account using `npm login` before publishing.

1.  First run `npm version patch` - Make sure your git working directory is clean before running
    this. Run this in a package directory to bump the version and write the new data back to
    `package.json`, `package-lock.json`. This will also kick off the following scripts in the given
    order.

    1.  `npm run preversion` - This runs the tests.
    2.  `npm run version` - This just reformats the code and adds any new to git.
    3.  After this step, npm automatically creates a git commit and a tag.
    4.  `npm run postversion` - This pushes all the new commit and tag.

2.  Finally run `npm publish` to publish it to npm, since all the changes that have been made so far
    are just local.

> Notes on `npm version`.
>
> 1. More info on [`npm version`][npm-4].
> 2. Instead of `patch` you can also choose `minor`, `major`, etc. You can also pass the new version
>    string explicitly as one of the arguments to this command, eg: `npm version 2.0 major`.

## IDEA configurations

- File watchers added to run `doctoc`, `prettier` on save for MD and TS files.
- Copyright configuration (to apply Apache 2.0 license) added for all the source files.

## References

- [Excellent tutorial on how to publish an npm package][r-1].
- [`.npmignore` and `files` directive in `package.json`][r-2].

[r-1]: https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c
[r-2]: https://stackoverflow.com/a/41285281/2085356
