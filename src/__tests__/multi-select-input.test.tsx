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
import { TextColor } from "../color-console-utils"
import { ListItem, MultiSelectInput } from "../ink-ui"
import { KeyCreator, Keypress, UseKeyboardWrapper } from "../node-keyb-utils"
import { useStateSafely } from "../react-ink-hook-utils"
import { Flag } from "./test-use-keyboard-helpers"

test("multi-select-input works", async () => {
  // Setup testing emitter.
  const emitter = new EventEmitter()
  const eventName = "testing-keypress"
  const testing = { emitter, eventName }
  
  // Setup some flags.
  const flagOnSubmit = new Flag()
  
  // Setup function component using multi-select-input to test.
  const Test: FC<{ items: ListItem[] }> = ({ items }) => {
    const [ selection, setSelection ] =
      useStateSafely<undefined | ListItem[]>(undefined).asArray()
    const [ hasFocus, setHasFocus ] = useStateSafely(true).asArray()
    
    const selectionStr = selection ?
      "selection=[" + selection?.map(({ label }) => label).join(", ") + "]" :
      "empty-selection"
    
    return (
      <UseKeyboardWrapper>
        <Box flexDirection="column">
          <Text color="gray">{selectionStr}</Text>
          <Text>
            {hasFocus ?
              TextColor.builder.green.build()("hasFocus") :
              TextColor.builder.red.build()("!hasFocus")}
          </Text>
          
          <MultiSelectInput
            items={items}
            hasFocus={hasFocus}
            onSubmit={onSubmit}
            testing={testing}
          />
        </Box>
      </UseKeyboardWrapper>
    )
    
    function onSubmit(selectedItems: ListItem[]) {
      setSelection(selectedItems)
      setHasFocus(false)
      flagOnSubmit.set()
    }
  }
  
  // Setup dummy data.
  const items = [ "one", "two", "three" ].map(it => new ListItem(it, it))
  const keys = {
    upKey: Keypress.buildImmutable(KeyCreator.upKey),
    downKey: Keypress.buildImmutable(KeyCreator.downKey),
    returnKey: Keypress.buildImmutable(KeyCreator.returnKey),
    spaceKey: Keypress.buildImmutable(KeyCreator.spaceKey),
  }
  
  // Run the test.
  const ink = render(<Test items={items}/>)
  expect(ink.lastFrame()).toContain("empty-selection")
  
  await delay(100)
  emitter.emit(eventName, keys.spaceKey)
  await delay(100)
  
  expect(ink.lastFrame()).toContain("◉")
  
  await delay(100)
  emitter.emit(eventName, keys.returnKey)
  await delay(100)
  
  expect(flagOnSubmit.isSet()).toBeTruthy()
  expect(ink.lastFrame()).toContain("selection=[")
  
  ink.unmount()
  emitter.removeAllListeners()
})