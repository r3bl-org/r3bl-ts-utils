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
  _also, _let, createNewShortcutsToActionMap, KeyBindingsForActions, KeyCreator, processKeyPress,
  useKeyboardWithMap, UserInputKeyPress, useTTYSize
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
      UserInputKeyPress.create(undefined, undefined),
      it => expect(it.toString()).toEqual("")
    )
    
    _also(UserInputKeyPress.create(undefined, "a"), it => {
      expect(it.toString()).toEqual("a")
      expect(it.input).toEqual("a")
      expect(it.key).toEqual("")
      expect(it.matches("a")).toBeTruthy()
    })
    
    _also(UserInputKeyPress.create(undefined, "q"), it => {
      expect(it.toString()).toEqual("q")
      expect(it.input).toEqual("q")
      expect(it.key).toEqual("")
      expect(it.matches("q")).toBeTruthy()
    })
    
    _also(UserInputKeyPress.create(KeyCreator.ctrlKey, "q"), it => {
      expect(it.toString()).toEqual("ctrl+q")
      expect(it.input).toEqual("q")
      expect(it.key).toEqual("ctrl")
      expect(it.matches("ctrl+q")).toBeTruthy()
    })
    
    _also(UserInputKeyPress.create(KeyCreator.ctrlKey, "a"), it => {
      expect(it.toString()).toEqual("ctrl+a")
      expect(it.input).toEqual("a")
      expect(it.key).toEqual("ctrl")
      expect(it.matches("ctrl+a")).toBeTruthy()
    })
    
    _also(UserInputKeyPress.create(KeyCreator.escapeKey, undefined), it => {
      expect(it.toString()).toEqual("escape")
      expect(it.input).toEqual("")
      expect(it.key).toEqual("escape")
      expect(it.matches("escape")).toBeTruthy()
    })
    
    _also(UserInputKeyPress.create(KeyCreator.tabKey, undefined), it => {
      it.setModifierKey("shift", true)
      expect(it.toString()).toEqual("shift+tab")
      expect(it.input).toEqual("")
      expect(it.key).toEqual("shift+tab")
      expect(it.matches("shift+tab")).toBeTruthy()
    })
    
    _also(UserInputKeyPress.create(KeyCreator.tabKey, undefined), it => {
      it.setModifierKey("meta", true)
      expect(it.toString()).toEqual("meta+tab")
      expect(it.input).toEqual("")
      expect(it.key).toEqual("meta+tab")
      expect(it.matches("meta+tab")).toBeTruthy()
    })
    
    _also(UserInputKeyPress.create(KeyCreator.tabKey, undefined), it => {
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
    
    const shortcutsToActionMap = _also(createNewShortcutsToActionMap(), map => map
      .set([ "q", "ctrl+q" ], fun1)
      .set([ "!" ], fun2.bind(this, "1"))
      .set([ "@" ], fun2.bind(this, "2"))
      .set([ "#" ], fun2.bind(this, "3")))
    
    processKeyPress(UserInputKeyPress.create(undefined, "q"), shortcutsToActionMap)
    expect(fun1Flag).toBeTruthy()
    
    fun1Flag = false
    processKeyPress(UserInputKeyPress.create(KeyCreator.ctrlKey, "q"), shortcutsToActionMap)
    expect(fun1Flag).toBeTruthy()
    
    processKeyPress(UserInputKeyPress.create(undefined, "!"), shortcutsToActionMap)
    expect(fun2State).toEqual("1")
    
    processKeyPress(UserInputKeyPress.create(undefined, "@"), shortcutsToActionMap)
    expect(fun2State).toEqual("2")
    
    processKeyPress(UserInputKeyPress.create(undefined, "#"), shortcutsToActionMap)
    expect(fun2State).toEqual("3")
  })
  
  test("isSpecialKey works", () => {
    type Tuple = [ UserInputKeyPress, string ]
    // These are special keys:
    //   "upArrow", "downArrow", "leftArrow", "rightArrow",
    //   "pageDown", "pageUp",
    //   "return", "escape", "tab", "backspace", "delete"
    _let(
      [
        [ UserInputKeyPress.create(KeyCreator.upKey, undefined), "uparrow" ], /* Tuple */
        [ UserInputKeyPress.create(KeyCreator.downKey, undefined), "downarrow" ], /* Tuple */
        [ UserInputKeyPress.create(KeyCreator.leftKey, undefined), "leftarrow" ], /* Tuple */
        [ UserInputKeyPress.create(KeyCreator.rightKey, undefined), "rightarrow" ], /* Tuple */
        [ UserInputKeyPress.create(KeyCreator.pageUpKey, undefined), "pageup" ], /* Tuple */
        [ UserInputKeyPress.create(KeyCreator.pageDownKey, undefined), "pagedown" ], /* Tuple */
        [ UserInputKeyPress.create(KeyCreator.returnKey, undefined), "return" ], /* Tuple */
        [ UserInputKeyPress.create(KeyCreator.escapeKey, undefined), "escape" ], /* Tuple */
        [ UserInputKeyPress.create(KeyCreator.tabKey, undefined), "tab" ], /* Tuple */
        [ UserInputKeyPress.create(KeyCreator.backspaceKey, undefined), "backspace" ], /* Tuple */
        [ UserInputKeyPress.create(KeyCreator.deleteKey, undefined), "delete" ], /* Tuple */
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
        [ UserInputKeyPress.create(KeyCreator.ctrlKey, undefined), "ctrl" ], /* tuple */
        [ UserInputKeyPress.create(KeyCreator.ctrlKey, "a"), "ctrl+a" ], /* tuple */
        [ UserInputKeyPress.create(KeyCreator.metaKey, undefined), "meta" ], /* tuple */
        [ UserInputKeyPress.create(KeyCreator.shiftKey, undefined), "shift" ], /* tuple */
        [ UserInputKeyPress.create(KeyCreator.shiftKey, "b"), "shift+b" ], /* tuple */
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
  
  test("Modifier keys work", () => {
    _also(UserInputKeyPress.create(KeyCreator.rightKey, undefined), keyPress => {
      keyPress.setModifierKey("shift", true)
      expect(keyPress.toString()).toEqual("shift+rightarrow")
    })
    _also(UserInputKeyPress.create(KeyCreator.rightKey, undefined), keyPress => {
      keyPress.setModifierKey("meta", true)
      expect(keyPress.toString()).toEqual("meta+rightarrow")
    })
    _also(UserInputKeyPress.create(KeyCreator.rightKey, undefined), keyPress => {
      keyPress.setModifierKey("ctrl", true)
      expect(keyPress.toString()).toEqual("ctrl+rightarrow")
    })
  })
  
  test("useKeyboard works on keypress", async done => {
    const flag = new Flag()
    
    const Test: FC = () => {
      const createShortcutsMap = () =>
        _also(
          createNewShortcutsToActionMap(),
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