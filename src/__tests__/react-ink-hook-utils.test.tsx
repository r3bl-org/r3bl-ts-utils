/*
 * Copyright 2021 R3BL LLC. All rights reserved.
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
  _also, _let, backspaceKey, createNewKeyPressesToActionMap, ctrlKey, deleteKey, downKey, escapeKey,
  KeyBindingsForActions, leftKey, metaKey, pageDownKey, pageUpKey, processKeyPress, returnKey,
  rightKey, shiftKey, tabKey, upKey, useKeyboardWithMap, UserInputKeyPress, useTTYSize
} from "../index"

import { delay, Flag } from "./test-use-keyboard-helpers"

// https://github.com/vadimdemedes/ink/blob/master/readme.md#testing
describe("useTTYSize", () => {
  test("hook works", () => {
    const propsObj = { rows: -1, columns: -1 }
    const TestEl = () => {
      const ttySize = useTTYSize()
      propsObj.rows = ttySize.rows
      propsObj.columns = ttySize.columns
      return <Text>Test</Text>
    }
    const { lastFrame } = render(<TestEl/>)
    expect(lastFrame()).toEqual("Test")
    expect(propsObj.rows).not.toEqual(-1)
    expect(propsObj.columns).not.toEqual(-1)
  })
})

describe("useKeyboard", () => {
  test("UserInputKeyPress works", () => {
    _also(
      new UserInputKeyPress(undefined, undefined),
      it => expect(it.toString()).toEqual("")
    )
    
    _also(new UserInputKeyPress(undefined, "a"), it => {
      expect(it.toString()).toEqual("a")
      expect(it.input).toEqual("a")
      expect(it.key).toEqual("")
      expect(it.matches("a")).toBeTruthy()
    })
    
    _also(new UserInputKeyPress(undefined, "q"), it => {
      expect(it.toString()).toEqual("q")
      expect(it.input).toEqual("q")
      expect(it.key).toEqual("")
      expect(it.matches("q")).toBeTruthy()
    })
    
    _also(new UserInputKeyPress(ctrlKey, "q"), it => {
      expect(it.toString()).toEqual("ctrl+q")
      expect(it.input).toEqual("q")
      expect(it.key).toEqual("ctrl")
      expect(it.matches("ctrl+q")).toBeTruthy()
    })
    
    _also(new UserInputKeyPress(ctrlKey, "a"), it => {
      expect(it.toString()).toEqual("ctrl+a")
      expect(it.input).toEqual("a")
      expect(it.key).toEqual("ctrl")
      expect(it.matches("ctrl+a")).toBeTruthy()
    })
    
    _also(new UserInputKeyPress(escapeKey, undefined), it => {
      expect(it.toString()).toEqual("escape")
      expect(it.input).toEqual("")
      expect(it.key).toEqual("escape")
      expect(it.matches("escape")).toBeTruthy()
    })
    
    _also(new UserInputKeyPress(tabKey, undefined), it => {
      it.setModifierKey("shift", true)
      expect(it.toString()).toEqual("shift+tab")
      expect(it.input).toEqual("")
      expect(it.key).toEqual("shift+tab")
      expect(it.matches("shift+tab")).toBeTruthy()
    })
    
    _also(new UserInputKeyPress(tabKey, undefined), it => {
      it.setModifierKey("meta", true)
      expect(it.toString()).toEqual("meta+tab")
      expect(it.input).toEqual("")
      expect(it.key).toEqual("meta+tab")
      expect(it.matches("meta+tab")).toBeTruthy()
    })
    
    _also(new UserInputKeyPress(tabKey, undefined), it => {
      it.setModifierKey("ctrl", true)
      expect(it.toString()).toEqual("ctrl+tab")
      expect(it.input).toEqual("")
      expect(it.key).toEqual("ctrl+tab")
      expect(it.matches("ctrl+tab")).toBeTruthy()
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
    
    const shortcutsToActionMap = _also(createNewKeyPressesToActionMap(), map => map
      .set([ "q", "ctrl+q" ], fun1)
      .set([ "!" ], fun2.bind(this, "1"))
      .set([ "@" ], fun2.bind(this, "2"))
      .set([ "#" ], fun2.bind(this, "3")))
    
    processKeyPress(new UserInputKeyPress(undefined, "q"), shortcutsToActionMap)
    expect(fun1Flag).toBeTruthy()
    
    fun1Flag = false
    processKeyPress(new UserInputKeyPress(ctrlKey, "q"), shortcutsToActionMap)
    expect(fun1Flag).toBeTruthy()
    
    processKeyPress(new UserInputKeyPress(undefined, "!"), shortcutsToActionMap)
    expect(fun2State).toEqual("1")
    
    processKeyPress(new UserInputKeyPress(undefined, "@"), shortcutsToActionMap)
    expect(fun2State).toEqual("2")
    
    processKeyPress(new UserInputKeyPress(undefined, "#"), shortcutsToActionMap)
    expect(fun2State).toEqual("3")
  })
  
  test("isSpecialKey, isModifierKey works", () => {
    type Tuple = [ UserInputKeyPress, string ]
    // These are special keys:
    //   "upArrow", "downArrow", "leftArrow", "rightArrow",
    //   "pageDown", "pageUp",
    //   "return", "escape", "tab", "backspace", "delete"
    _let(
      [
        [ new UserInputKeyPress(upKey, undefined), "uparrow" ], /* Tuple */
        [ new UserInputKeyPress(downKey, undefined), "downarrow" ], /* Tuple */
        [ new UserInputKeyPress(leftKey, undefined), "leftarrow" ], /* Tuple */
        [ new UserInputKeyPress(rightKey, undefined), "rightarrow" ], /* Tuple */
        [ new UserInputKeyPress(pageUpKey, undefined), "pageup" ], /* Tuple */
        [ new UserInputKeyPress(pageDownKey, undefined), "pagedown" ], /* Tuple */
        [ new UserInputKeyPress(returnKey, undefined), "return" ], /* Tuple */
        [ new UserInputKeyPress(escapeKey, undefined), "escape" ], /* Tuple */
        [ new UserInputKeyPress(tabKey, undefined), "tab" ], /* Tuple */
        [ new UserInputKeyPress(backspaceKey, undefined), "backspace" ], /* Tuple */
        [ new UserInputKeyPress(deleteKey, undefined), "delete" ], /* Tuple */
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
        [ new UserInputKeyPress(ctrlKey, undefined), "ctrl" ], /* tuple */
        [ new UserInputKeyPress(ctrlKey, "a"), "ctrl+a" ], /* tuple */
        [ new UserInputKeyPress(metaKey, undefined), "meta" ], /* tuple */
        [ new UserInputKeyPress(shiftKey, undefined), "shift" ], /* tuple */
        [ new UserInputKeyPress(shiftKey, "b"), "shift+b" ], /* tuple */
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
  
  test("useKeyboard works on keypress", async done => {
    const flag = new Flag()
    
    const Test: FC = () => {
      const createShortcutsMap = () =>
        _also(
          createNewKeyPressesToActionMap(),
          map => map
            .set([ "q", "ctrl+q" ], flag.set)
            .set([ "x", "ctrl+x" ], flag.set)
        )
      const map: KeyBindingsForActions = useMemo(createShortcutsMap, [])
      const { keyPress, inRawMode } = useKeyboardWithMap(map)
      
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
  
})