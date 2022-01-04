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

import { Box, Text } from "ink"
import { render } from "ink-testing-library"
import * as React from "react"
import { FC, useMemo } from "react"
import {
  _also, _let, createMutableCopyOf, createNewShortcutToActionMap, KeyCreator, Keypress,
  processKeyPress, ShortcutToActionMap, useKeyboardCompatInkWithMap
} from "../index"
import { delay, Flag } from "./test-use-keyboard-helpers"

test("KeyPress works", () => {
  _also(
    createMutableCopyOf(undefined, undefined),
    it => expect(it.toString()).toEqual("")
  )
  
  _also(createMutableCopyOf(undefined, "a"), it => {
    expect(it.toString()).toEqual("a")
    expect(it.input).toEqual("a")
    expect(it.key).toEqual("")
    expect(it.matches("a")).toBeTruthy()
  })
  
  _also(createMutableCopyOf(undefined, "q"), it => {
    expect(it.toString()).toEqual("q")
    expect(it.input).toEqual("q")
    expect(it.key).toEqual("")
    expect(it.matches("q")).toBeTruthy()
  })
  
  _also(createMutableCopyOf(KeyCreator.ctrlKey, "q"), it => {
    expect(it.toString()).toEqual("ctrl+q")
    expect(it.input).toEqual("q")
    expect(it.key).toEqual("ctrl")
    expect(it.matches("ctrl+q")).toBeTruthy()
  })
  
  _also(createMutableCopyOf(KeyCreator.ctrlKey, "a"), it => {
    expect(it.toString()).toEqual("ctrl+a")
    expect(it.input).toEqual("a")
    expect(it.key).toEqual("ctrl")
    expect(it.matches("ctrl+a")).toBeTruthy()
  })
  
  _also(createMutableCopyOf(KeyCreator.escapeKey, undefined), it => {
    expect(it.toString()).toEqual("escape")
    expect(it.input).toEqual("")
    expect(it.key).toEqual("escape")
    expect(it.matches("escape")).toBeTruthy()
  })
  
  _also(createMutableCopyOf(KeyCreator.tabKey, undefined), it => {
    const immutableCopy = it.setModifierKey("shift", true)
    expect(immutableCopy.toString()).toEqual("shift+tab")
    expect(immutableCopy.input).toEqual("")
    expect(immutableCopy.key).toEqual("shift+tab")
    expect(immutableCopy.matches("shift+tab")).toBeTruthy()
  })
  
  _also(createMutableCopyOf(KeyCreator.tabKey, undefined), it => {
    const immutableCopy = it.setModifierKey("meta", true)
    expect(immutableCopy.toString()).toEqual("meta+tab")
    expect(immutableCopy.input).toEqual("")
    expect(immutableCopy.key).toEqual("meta+tab")
    expect(immutableCopy.matches("meta+tab")).toBeTruthy()
  })
  
  _also(createMutableCopyOf(KeyCreator.tabKey, undefined), it => {
    const immutableCopy = it.setModifierKey("ctrl", true)
    expect(immutableCopy.toString()).toEqual("ctrl+tab")
    expect(immutableCopy.input).toEqual("")
    expect(immutableCopy.key).toEqual("ctrl+tab")
    expect(immutableCopy.matches("ctrl+tab")).toBeTruthy()
  })
})

test("processKeyPress works", () => {
  let fun1Flag = false
  let fun2State = ""
  
  function fun1() {
    fun1Flag = true
  }
  
  function fun2(arg: string) {
    fun2State = arg
  }
  
  const shortcutsToActionMap = _also(createNewShortcutToActionMap(), map => map
    .set("q", fun1)
    .set("ctrl+q", fun1)
    .set("!", fun2.bind(this, "1"))
    .set("@", fun2.bind(this, "2"))
    .set("#", fun2.bind(this, "3")))
  
  processKeyPress(createMutableCopyOf(undefined, "q"), shortcutsToActionMap)
  expect(fun1Flag).toBeTruthy()
  
  fun1Flag = false
  processKeyPress(createMutableCopyOf(KeyCreator.ctrlKey, "q"), shortcutsToActionMap)
  expect(fun1Flag).toBeTruthy()
  
  processKeyPress(createMutableCopyOf(undefined, "!"), shortcutsToActionMap)
  expect(fun2State).toEqual("1")
  
  processKeyPress(createMutableCopyOf(undefined, "@"), shortcutsToActionMap)
  expect(fun2State).toEqual("2")
  
  processKeyPress(createMutableCopyOf(undefined, "#"), shortcutsToActionMap)
  expect(fun2State).toEqual("3")
})

test("KeyPress isSpecialKey works (and validate KeyCreator constants)", () => {
  type Tuple = [ Keypress, string ]
  // These are special keys:
  //   "upArrow", "downArrow", "leftArrow", "rightArrow",
  //   "pageDown", "pageUp",
  //   "return", "escape", "tab", "backspace", "delete"
  
  _let(
    [
      [ createMutableCopyOf(KeyCreator.upKey, undefined), "uparrow" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.downKey, undefined), "downarrow" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.leftKey, undefined), "leftarrow" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.rightKey, undefined), "rightarrow" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.pageUpKey, undefined), "pageup" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.pageDownKey, undefined), "pagedown" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.returnKey, undefined), "return" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.escapeKey, undefined), "escape" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.tabKey, undefined), "tab" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.backspaceKey, undefined), "backspace" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.spaceKey, undefined), "space" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.deleteKey, undefined), "delete" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.homeKey, undefined), "home" ], /* Tuple */
      [ createMutableCopyOf(KeyCreator.endKey, undefined), "end" ], /* Tuple */
    ] as Array<Tuple>,
    array => array.forEach(
      tuple => {
        const [ keyPress, shortcut ] = tuple
        expect(keyPress.isSpecialKey()).toBeTruthy()
        expect(keyPress.toString()).toEqual(shortcut)
      })
  )
  
  // These are not special keys: "ctrl", "meta", "shift".
  _let(
    [
      [ createMutableCopyOf(KeyCreator.ctrlKey, undefined), "ctrl" ], /* tuple */
      [ createMutableCopyOf(KeyCreator.ctrlKey, "a"), "ctrl+a" ], /* tuple */
      [ createMutableCopyOf(KeyCreator.metaKey, undefined), "meta" ], /* tuple */
      [ createMutableCopyOf(KeyCreator.shiftKey, undefined), "shift" ], /* tuple */
      [ createMutableCopyOf(KeyCreator.shiftKey, "b"), "shift+b" ], /* tuple */
    ] as Array<Tuple>,
    array => array.forEach(
      tuple => {
        const [ keyPress, shortcut ] = tuple
        expect(keyPress.isSpecialKey()).toBeFalsy()
        expect(keyPress.isModifierKey()).toBeTruthy()
        expect(keyPress.toString()).toEqual(shortcut)
      })
  )
})

test("KeyPress modifier keys work", () => {
  _also(createMutableCopyOf(KeyCreator.rightKey, undefined), it => {
    const immutableCopy = it.setModifierKey("shift", true)
    expect(immutableCopy.toString()).toEqual("shift+rightarrow")
  })
  _also(createMutableCopyOf(KeyCreator.rightKey, undefined), it => {
    const immutableCopy = it.setModifierKey("meta", true)
    expect(immutableCopy.toString()).toEqual("meta+rightarrow")
  })
  _also(createMutableCopyOf(KeyCreator.rightKey, undefined), it => {
    const immutableCopy = it.setModifierKey("ctrl", true)
    expect(immutableCopy.toString()).toEqual("ctrl+rightarrow")
  })
})

test("useKeyboard works", async done => {
  const flag = new Flag()
  
  const Test: FC = () => {
    const createShortcutsMap = () =>
      _also(
        createNewShortcutToActionMap(),
        map => map
          .set("q", flag.set)
          .set("ctrl+q", flag.set)
          .set("x", flag.set)
          .set("ctrl+x", flag.set)
      )
    const map: ShortcutToActionMap = useMemo(createShortcutsMap, [])
    const { keyPress, inRawMode } = useKeyboardCompatInkWithMap(map)
    
    return (<Box flexDirection="column">
      {keyPress && <Row_Debug inRawMode={inRawMode} keyPress={keyPress.toString()}/>}
      <Text>"Your example goes here!"</Text>
    </Box>)
  }
  
  const Row_Debug: FC<{ inRawMode: boolean; keyPress: string | undefined }> = ({
    keyPress, inRawMode,
  }) =>
    inRawMode ?
      (<Text color="magenta">keyPress: {keyPress}</Text>) :
      (<Text color="gray">keyb disabled</Text>)
  
  const ink = render(<Test/>)
  
  await delay(100)
  ink.stdin.emit("data", "q")
  await delay(100)
  
  expect(flag.isSet()).toBeTruthy()
  done()
})
