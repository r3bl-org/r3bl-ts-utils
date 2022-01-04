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

import { Box, render, Text, useInput } from "ink"
import TextInput from "ink-text-input"
import React, { EffectCallback, FC, useEffect, useState } from "react"
import {
  _also, _callIfTrue, _callIfTruthyWithReturn, _let, createNewShortcutToActionMap, LifecycleHelper,
  logTTYState, noop, ShortcutToActionMap, StateHolder, TextColor, TimerRegistry,
  UseKeyboardReturnValue, useKeyboardWithMapCached,
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
  textInputStateHolder: StateHolder<TextInputState>
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
    textInputStateHolder: StateHolder.createFromArray(useState(new TextInputState())),
    useKeyboard: useKeyboardWithMapCached(createShortcuts),
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
  
  DEBUG && logTTYState("App render")
  
  return (
    <Box flexDirection="column">
      <RowDebug ctx={ctx}/>
      {textInputState.isVisible ?
        <TextInputComponent ctx={ctx}/> :
        <Text>{TextColor.builder.cyan.underline.bold.build()(textInputState.text)}</Text>}
    </Box>
  )
}

const TextInputComponent: FC<InternalProps> = ({ ctx }) => {
  const [ text, setText ] = useState("")
  
  // ⚠ This ensures that onSubmit or focus = false does not set raw mode to false, which will
  // make the Node.js process exit (due to way in which useKeyboard works).
  // Check out readme.md for more detailed information.
  useInput(noop)
  
  const [ myTextInputState, setMyTextInputState ] = ctx.textInputStateHolder.asArray()
  const onSubmit = () => {
    setMyTextInputState(new TextInputState(false, true, text)) // same as (false, true, text)
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
        onSubmit={onSubmit}/>
    </Box>
  )
}

// Helpers.

// Allows multiple App components to be added.
const Wrapper: FC = () =>
  <>
    <Text color="gray">Press ctrl+x to exit</Text>
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

// main().

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
