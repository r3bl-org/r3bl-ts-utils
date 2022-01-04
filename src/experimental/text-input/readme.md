# The problem with useInput

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Background](#background)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Background

Ink has a hook that is supposed to be used to get user input from the keyboard called `useInput`,
which comes from the `ink` package. `TextInput` is built on top of this hook. `TextInput` comes from
the npm package `ink-text-input`.

1. [useInput sets raw mode to false](https://github.com/vadimdemedes/ink/blob/master/src/hooks/use-input.ts#L126)
2. [TextInput uses useInput](https://github.com/vadimdemedes/ink-text-input/blob/master/source/index.tsx#L117)

I created a new hook `useKeyboard` which makes some assumptions.

1. It will set raw mode to true when used.
2. It will turn raw mode to false when unmounted.

The problem w/ `TextInput` using `useInput` and then turning raw mode to off when focus changes on
`TextInput` simply causes the Node.js process to exit, since there are no active listeners attached
to it 🤯.

To mitigate this problem is really simple - just make sure to call `useInput(noop)` somewhere in the
component that includes `TextInput`!
