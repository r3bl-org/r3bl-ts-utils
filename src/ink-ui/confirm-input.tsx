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

import { useInput } from "ink"
import TextInput from "ink-text-input"
import { Key } from "ink/build/hooks/use-input"
import _ from "lodash"
import React, { FC } from "react"
import { _callIfTrue, Keypress, StateHook, useKeyboard, useStateSafely } from "../index"

const DEBUG = false
const FLAG_HANDLE_INPUT_IMPL: "useInput" | "useNodeKeypress" = "useInput"

interface Props {
  placeholderBeforeSubmit: string
  placeholderAfterSubmit: string
  defaultValue: boolean // https://stackoverflow.com/a/60817451/2085356
  onSubmit: (answer: boolean) => void
}

export const ConfirmInput: FC<Props> =
  ({ defaultValue, onSubmit, placeholderBeforeSubmit, placeholderAfterSubmit }) => {
    const [ value, setValue ]: StateHook<string> = useStateSafely("").asArray()
    const [ showCursor, setShowCursor ]: StateHook<boolean> = useStateSafely(true).asArray()
    
    if (FLAG_HANDLE_INPUT_IMPL === "useInput") {
      const fun = (_input: string, key: Key) => {
        if (key.backspace || key.delete) setValue("")
        DEBUG && console.log("ConfirmInput ... keypress detected")
      }
      useInput(fun, { isActive: showCursor })
    } else {
      const fun = (input: Readonly<Keypress>) => _callIfTrue(
        _.includes([ "backspace", "delete" ], input.toString()),
        () => {
          if (!showCursor) return
          setValue("")
          DEBUG && console.log("ConfirmInput ... keypress detected")
        }
      )
      useKeyboard(fun, [ showCursor ])
    }
    
    const onSubmitHandler = (userInput: string) => {
      onSubmit(userInput ? userInput === "y" : defaultValue)
      setValue("")
      setShowCursor(false)
    }
    
    const onChangeHandler = (userInput: string) => {
      if (userInput.toLowerCase() === "y" || userInput.toLowerCase() === "n") setValue(userInput)
    }
    
    return (
      <TextInput
        focus={showCursor}
        showCursor={showCursor}
        placeholder={showCursor ? placeholderBeforeSubmit : placeholderAfterSubmit}
        value={value}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
      />
    )
  }