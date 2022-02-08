/*
 * Copyright (c) 2021-2022 R3BL LLC. All rights reserved.
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

import { Box, render, Text } from "ink"
import TextInput from "ink-text-input"
import React, { EffectCallback, FC, useEffect } from "react"
import {
  createNewShortcutToActionMap, inkCLIAppMainFn,
  LifecycleHelper, ShortcutToActionMap, StateHolder, TextColor, useKeyboardBuilder,
  UseKeyboardReturnValue, useStateSafely, _also, _callIfTrue, _callIfTruthyWithReturn
} from "../../index"

// Constants & types.

const DEBUG = false
let count = 0

class TextInputState {
  constructor(
    readonly hasFocus: boolean = true,
    readonly isVisible: boolean = true,
    readonly text: string = ""
  ) { }

  toString = () => JSON.stringify(this)
}

type HookOutput = {
  useKeyboard: UseKeyboardReturnValue
  textInputStateHolder: StateHolder<TextInputState>
  uid: string
}

type InternalProps = { ctx: HookOutput }

// Hooks.

export const runHooks = (): HookOutput => {
  const createShortcutsFn = (): ShortcutToActionMap => _also(
    createNewShortcutToActionMap(),
    map => map
      .set("ctrl+x", LifecycleHelper.fireExit)
  )

  return {
    textInputStateHolder: useStateSafely(new TextInputState()),
    useKeyboard: useKeyboardBuilder({
      type: "ink-compat",
      args: { type: "map-cached", createShortcutsFn, options: { isActive: true } }
    }),
    uid: `${count++}`
  }
}

// Function component.


const App: FC = () => {
  const ctx: HookOutput = runHooks()
  const { useKeyboard, textInputStateHolder, uid } = ctx
  const [ textInputState ] = textInputStateHolder.asArray()

  // Debug.
  _callIfTrue(DEBUG, () => {
    useEffect(getDebugLogSideEffectFn(textInputState, useKeyboard, uid))
    useEffect(getDebugMountLoggerEffectFn(), [])
  })

  return (
    <Box flexDirection="column">
      <RowDebug ctx={ctx} />
      {textInputState.isVisible ?
        <TextInputComponent ctx={ctx} /> :
        <Text>{TextColor.builder.cyan.underline.bold.build()(textInputState.text)}</Text>}
    </Box>
  )
}

const TextInputComponent: FC<InternalProps> = ({ ctx }) => {
  const [ text, setText ] = useStateSafely("").asArray()

  const [ myTextInputState, setMyTextInputState ] = ctx.textInputStateHolder.asArray()
  const onSubmit = () => {
    setMyTextInputState(new TextInputState(true, false, text))
    console.log(TextColor.builder.bold.black.bgYellow.build()("onSubmit called!"))
  }

  return (
    <Box>
      <Box marginRight={1}>
        <Text>Enter your query:</Text>
      </Box>

      <TextInput
        focus={myTextInputState.hasFocus}
        value={text}
        onChange={setText}
        onSubmit={onSubmit} />
    </Box>
  )
}

// Helpers.

// Allows multiple App components to be added.
const Wrapper: FC = () =>
  <>
    <Text color="gray">Press ctrl+x to exit</Text>
    <App />
  </>

const RowDebug: FC<InternalProps> = ({ ctx }) => {
  const { keyPress, inRawMode } = ctx.useKeyboard
  return inRawMode ?
    <Text color="magenta">keyPress: {
      keyPress.isSome() ? `${keyPress.value.toString()}` : "n/a"
    }</Text> :
    <Text color="gray">keyb disabled</Text>
}

const getDebugMountLoggerEffectFn = (): EffectCallback => () => {
  console.log(TextColor.builder.green.build()("mount"))
  return () => console.log(TextColor.builder.gray.build()("unmount"))
}

const getDebugLogSideEffectFn = (
  textInputState: TextInputState,
  useKeyboard: UseKeyboardReturnValue,
  uid: string
): EffectCallback => () => {
  const myStateToStr = textInputState.toString()
  const keyPress = _callIfTruthyWithReturn(
    useKeyboard.keyPress,
    it => it.toString(),
    () => "",
  )
  const text = `${uid}, ${myStateToStr}, ${keyPress}`
  console.log(TextColor.builder.randomFgColor.build()(text))
}

// Main.
inkCLIAppMainFn(
  () => render(<Wrapper />),
  "Exiting ink",
  "Problem w/ exiting ink"
).catch(console.error)
