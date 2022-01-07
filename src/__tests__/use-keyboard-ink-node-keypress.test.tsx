/*
 * Copyright (c) 2022 R3BL LLC. All rights reserved.
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

import delay from "delay"
import EventEmitter from "events"
import { Box, Text } from "ink"
import { render } from "ink-testing-library"
import * as React from "react"
import { FC } from "react"
import {
  _also, createNewShortcutToActionMap, IsActive, KeyboardInputHandlerFn, ReadlineKey,
  ShortcutToActionMap, useKeyboardBuilder, UseKeyboardConfig
} from "../index"
import { Flag } from "./test-use-keyboard-helpers"

test("useKeyboard node-keypress works", async done => {
  const flag = new Flag()
  
  const Test: FC<{ options: UseKeyboardConfig, index: number }> = (
    { options, index }
  ) => {
    const { keyPress, inRawMode } = useKeyboardBuilder(options)
    return (<Box flexDirection="column">
      {keyPress && <Row_Debug inRawMode={inRawMode} keyPress={keyPress.toString()}/>}
      <Text>{index} - Your example goes here!</Text>
    </Box>)
  }
  
  const Row_Debug: FC<{ inRawMode: boolean; keyPress: string | undefined }> = (
    { keyPress, inRawMode }
  ) => inRawMode ?
    <Text color="magenta">keyPress: {keyPress}</Text> :
    <Text color="gray">keyb disabled</Text>
  
  const createShortcutsFn = (): ShortcutToActionMap => _also(
    createNewShortcutToActionMap(),
    map => map.set("q", flag.set)
  )
  const matchKeypressFn: KeyboardInputHandlerFn = input => {
    if (input.matches("q")) flag.set()
  }
  
  const options: IsActive = { isActive: true }
  
  const configArray: UseKeyboardConfig[] =
    [
      { type: "node-keypress", args: { type: "fun", matchKeypressFn, options } },
      { type: "node-keypress", args: { type: "map", map: createShortcutsFn(), options } },
      { type: "node-keypress", args: { type: "map-cached", createShortcutsFn, options } },
    ]
  
  for (const [ index, options ] of configArray.entries()) {
    flag.reset()
    
    const emitter = new EventEmitter()
    const eventName = "testing-keypress"
    const input = "q"
    const key: ReadlineKey = { ctrl: false, meta: false, shift: false }
    
    const optionsWithTesting = {
      ...options,
      testing: { emitter, eventName }
    }
    
    const ink = render(<Test index={index} options={optionsWithTesting}/>)
    await delay(100)
    emitter.emit(eventName, input, key)
    await delay(100)
    expect(flag.isSet()).toBeTruthy()
    expect(ink.lastFrame()).toContain("keyPress")
    
    ink.unmount()
    emitter.removeAllListeners()
  }
  
  done()
})