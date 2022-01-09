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
  _also, _callIfTrue, _callIfTruthyWithReturn, _let, createNewShortcutToActionMap, LifecycleHelper,
  logTTYState, ShortcutToActionMap, StateHolder, TextColor, TimerRegistry, UseKeyboardReturnValue,
  useKeyboardWithMapCached, UseKeyboardWrapper, useStateSafely,
} from "../../index"

// Constants & types.

const DEBUG = false
let count = 0

class TextInputState {
  constructor(
    readonly hasFocus: boolean = true,
    readonly isVisible: boolean = true,
    readonly text: string = ""
  ) {}
  
  toString = () => JSON.stringify(this)
}

type HookOutput = {
  useKeyboard: UseKeyboardReturnValue
  textInput1_StateHolder: StateHolder<TextInputState>
  textInput2_StateHolder: StateHolder<TextInputState>
  uid: string
}

type InternalProps = { ctx: HookOutput }

// Hooks.

export const runHooks = (): HookOutput => {
  const createShortcuts = (): ShortcutToActionMap => _also(
    createNewShortcutToActionMap(),
    map => map
      .set("ctrl+x", LifecycleHelper.fireExit)
  )
  
  return {
    textInput1_StateHolder: useStateSafely(new TextInputState()),
    textInput2_StateHolder: useStateSafely(new TextInputState()),
    useKeyboard: useKeyboardWithMapCached(createShortcuts),
    uid: `${count++}`
  }
}

// Function component.

/**
 * No need for usePreventUseInputFromSettingRawModeToFalseAndExiting() since Provider is used.
 */
const App: FC = () => {
  const ctx: HookOutput = runHooks()
  const { useKeyboard, textInput1_StateHolder, textInput2_StateHolder, uid } = ctx
  const [ textInput1_State ] = textInput1_StateHolder.asArray()
  const [ textInput2_State ] = textInput2_StateHolder.asArray()
  
  // Debug.
  _callIfTrue(DEBUG, () => {
    useEffect(getDebugLogSideEffectFn(textInput1_State, useKeyboard, uid))
    useEffect(getDebugMountLoggerEffectFn(), [])
  })
  
  DEBUG && logTTYState("App render")
  
  return (
    <UseKeyboardWrapper>
      <Text color="gray">Press ctrl+x to exit</Text>
      <Box flexDirection="column">
        <RowDebug ctx={ctx}/>
        {textInput1_State.isVisible ?
          <TextInputComponentChangeVisible ctx={ctx}/> :
          <Text>{TextColor.builder.cyan.underline.bold.build()(textInput1_State.text)}</Text>}
        {textInput2_State.isVisible ?
          <TextInputComponentChangeFocus ctx={ctx}/> :
          <Text>{TextColor.builder.cyan.underline.bold.build()(textInput1_State.text)}</Text>}
      </Box>
    </UseKeyboardWrapper>
  )
}

const TextInputComponentChangeVisible: FC<InternalProps> = ({ ctx }) => {
  const [ text, setText ] = useStateSafely("").asArray()
  
  const [ myTextInputState, setMyTextInputState ] = ctx.textInput1_StateHolder.asArray()
  const onSubmit = () => {
    setMyTextInputState(new TextInputState(true, false, text))
    console.log(TextColor.builder.bold.black.bgYellow.build()(
      "TextInputComponentChangeVisible onSubmit called!"))
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
        onSubmit={onSubmit}/>
    </Box>
  )
}

const TextInputComponentChangeFocus: FC<InternalProps> = ({ ctx }) => {
  const [ text, setText ] = useStateSafely("").asArray()
  
  const [ myTextInputState, setMyTextInputState ] = ctx.textInput2_StateHolder.asArray()
  const onSubmit = () => {
    setMyTextInputState(new TextInputState(false, true, text))
    console.log(TextColor.builder.bold.black.bgYellow.build()(
      "TextInputComponentChangeFocus onSubmit called!"))
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
        onSubmit={onSubmit}/>
    </Box>
  )
}

// Helpers.

// Allows multiple App components to be added.
const Wrapper: FC = () =>
  <>
    <App/>
  </>

const RowDebug: FC<InternalProps> = ({ ctx }) => {
  const { keyPress, inRawMode } = ctx.useKeyboard
  return inRawMode ?
    <Text color="magenta">keyPress: {keyPress ? `${keyPress.toString()}` : "n/a"}</Text> :
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
_let(render(<Wrapper/>), instance => {
  LifecycleHelper.addExitListener(() => {
    DEBUG && logTTYState("exitListener 1 -> stdin.isRaw")
    
    TimerRegistry.killAll()
    instance.unmount()
    
    DEBUG && logTTYState("exitListener 2 -> stdin.isRaw")
    
    instance.waitUntilExit()
      .then(() => {
        console.log(TextColor.builder.bgYellow.black.build()("Exiting ink"))
      })
      .catch(() => {
        console.error(TextColor.builder.bgYellow.black.build()("Problem with exiting ink"))
      })
  })
})
