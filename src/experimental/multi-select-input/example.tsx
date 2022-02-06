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

import { Box, render, Text } from "ink"
import React, { FC, useMemo } from "react"
import { _also } from "../../lang-utils/kotlin-lang-utils"
import { TextColor } from "../../tui-colors"
import { ListItem, MultiSelectInput } from "../../tui-components"
import { inkCLIAppMainFn, LifecycleHelper, useStateSafely } from "../../tui-core"
import {
  createNewShortcutToActionMap, ShortcutToActionMap, useKeyboardWithMapCached, UseKeyboardWrapper
} from "../../tui-node-keyboard"

// Function component.

const App: FC<{ items: ListItem[] }> = ({ items }) => {
  const [ selection, setSelection ] =
    useStateSafely<undefined | ListItem[]>(undefined).asArray()
  const [ hasFocus, setHasFocus ] = useStateSafely(true).asArray()
  
  const selectionStr = selection ?
    "selection=[" + selection?.map(({ label }) => label).join(", ") + "]" :
    "empty-selection"
  
  return (
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
      />
    </Box>
  )
  
  function onSubmit(selectedItems: ListItem[]) {
    setSelection(selectedItems)
    setHasFocus(false)
  }
}

const Wrapper: FC = () => {
  const createShortcutsFn = (): ShortcutToActionMap => _also(
    createNewShortcutToActionMap(),
    map => map.set("q", LifecycleHelper.fireExit)
  )
  useKeyboardWithMapCached(createShortcutsFn)
  
  const items = useMemo(
    () => [ "one", "two", "three" ]
      .map(it => ListItem.createImmutable(it, it)),
    []
  )
  
  return (
    <UseKeyboardWrapper>
      <App items={items}/>
    </UseKeyboardWrapper>
  )
}

// Main.
inkCLIAppMainFn(
  () => render(<Wrapper/>),
  "Exiting ink",
  "Problem w/ exiting ink"
).catch(console.error)
