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

import TextInput from "ink-text-input"
import React, { FC } from "react"
import {
  _also, createNewShortcutToActionMap, ShortcutToActionMap, StateHook, useKeyboardWithMapCached,
  useStateSafely
} from "../index"

interface Props {
  placeholderBeforeSubmit: string
  placeholderAfterSubmit: string
  defaultValue: boolean // https://stackoverflow.com/a/60817451/2085356
  onSubmit: (answer: boolean) => void
}

// TODO add this to README
export const ConfirmInput: FC<Props> =
  ({ defaultValue, onSubmit, placeholderBeforeSubmit, placeholderAfterSubmit }) => {
    const [ value, setValue ]: StateHook<string> = useStateSafely("").asArray()
    const [ showCursor, setShowCursor ]: StateHook<boolean> = useStateSafely(true).asArray()
    
    const createShortcutsFn = (): ShortcutToActionMap => _also(
      createNewShortcutToActionMap(),
      map => map
        .set("backspace", () => setValue(""))
        .set("delete", () => setValue(""))
    )
    useKeyboardWithMapCached(createShortcutsFn)
    
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
        showCursor={showCursor}
        placeholder={showCursor ? placeholderBeforeSubmit : placeholderAfterSubmit}
        value={value}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
      />
    )
  }