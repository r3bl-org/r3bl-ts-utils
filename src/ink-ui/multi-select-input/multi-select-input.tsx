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
import { noop } from "lodash"
import React, { FC, useEffect } from "react"
import {
  _callIfTrue, _callIfTruthy, _callIfTruthyWithReturn, Keypress, TextColor, useKeyboard,
  useStateSafely
} from "../../index"
import { CheckBox } from "./checkbox"
import { Indicator } from "./indicator"
import { Item } from "./item"
import { ListItem, MultiSelectInputProps } from "./types"
import { arrRotate } from "./utils"

const DEBUG = false

export const MultiSelectInput: FC<MultiSelectInputProps> = ({
  items, /* Only required prop. */
  hasFocus = true,
  singleSelectionMode = false,
  maxRows = -1,
  initialHighlightedIndex = 0,
  initialSelected = new Array<ListItem>(),
  indicatorComponent = Indicator,
  itemComponent = Item,
  checkboxComponent = CheckBox,
  onHighlight = noop,
  onSelect = noop,
  onUnselect = noop,
  onSubmit = noop,
  testing = undefined,
}) => {
  // Generate state from props.
  const [ rotateIndex, setRotateIndex ] = useStateSafely(0).asArray()
  const [ highlightedIndex, setHighlightedIndex ] =
    useStateSafely(initialHighlightedIndex).asArray()
  const [ selected, setSelected ] = useStateSafely(initialSelected).asArray()
  
  // Check whether scrolling is active and item needs to be sliced based on "viewport".
  const isScrollActive = isScrollable()
  const slicedItemsToDisplay = sliceItemsIfScrollable()
  
  // Handle keyboard inputs.
  function onKeypress(keypress: Readonly<Keypress>) {
    if (keypress.matches("return")) returnPressed()
    if (keypress.matches("downarrow")) downarrowPressed()
    if (keypress.matches("uparrow")) uparrowPressed()
    if (keypress.matches("space")) spacePressed()
    if (keypress.matches("delete")) deletePressed()
    if (keypress.matches("backspace")) deletePressed()
  }
  
  // Testing bypass process.stdin as the event emitter for "keypress" events (via readline).
  // @see use-keyboard.tsx
  _callIfTruthyWithReturn(
    testing,
    // Testing mode.
    ({ emitter, eventName }) => {
      // https://stackoverflow.com/questions/53898810/executing-async-code-on-update-of-state-with-react-hooks
      // https://github.com/r3bl-org/r3bl-ts-utils/commit/a3248540ea325d3896ee56a84d003f15529169cd
      // http://developerlife.com/2021/10/19/react-hooks-redux-typescript-handbook/#custom-hooks
      useEffect(
        () => {emitter.on(eventName, onKeypress)},
        // Provide states that are affected by this effect, so they can update!
        [ highlightedIndex, selected ]
      )
    },
    // Production mode.
    () => {
      useKeyboard(onKeypress, { isActive: hasFocus }, testing)
    }
  )
  
  return (
    <Box flexDirection="column">
      {slicedItemsToDisplay.map(renderListItem)}
      {DEBUG && <DebugRow/>}
    </Box>
  )
  
  function DebugRow() {
    const selectedStr = selected?.map(({ label }) => label).join(", ")
    return (
      <Box flexDirection="column">
        <Text>hasFocus: {hasFocus ? "true" : "false"}</Text>
        <Text>isScrollActive: {isScrollActive ? "true" : "false"}</Text>
        <Text>slicedItemsToDisplay: {slicedItemsToDisplay.length}</Text>
        <Text>getRowsToDisplay: {getRowsToDisplay()}</Text>
        <Text>rotateIndex: {rotateIndex}</Text>
        <Text>highlightedIndex: {TextColor.builder.red.bold.build()(`${highlightedIndex}`)}</Text>
        <Text>selected: {selectedStr}</Text>
      </Box>)
  }
  
  function renderListItem(item: ListItem, index: number) {
    const { key, label } = item
    const isHighlighted = index === highlightedIndex
    const isSelected = isItemSelected(selected, key)
    
    return (
      <Box key={key}>
        {React.createElement(indicatorComponent, { isHighlighted })}
        {React.createElement(checkboxComponent, { isSelected, singleSelectionMode })}
        {React.createElement(itemComponent, { label, isHighlighted })}
      </Box>
    )
  }
  
  function sliceItemsIfScrollable(): ListItem[] {
    return isScrollable() ? arrRotate(items, rotateIndex).slice(0, getRowsToDisplay()) : items
  }
  
  function isMaxRowsDefined(): boolean {
    return maxRows !== -1
  }
  
  function isScrollable(): boolean {
    return isMaxRowsDefined() && items.length > maxRows
  }
  
  function getRowsToDisplay(): number {
    return isMaxRowsDefined() ? items.length : maxRows
  }
  
  function uparrowPressed(): void {
    DEBUG && console.log(TextColor.builder.magenta.build()("uparrowPressed"))
    
    const lastIndex = (isScrollable() ? getRowsToDisplay() : items.length) - 1
    const atFirstIndex = highlightedIndex === 0
    const nextIndex = (isScrollable() ? highlightedIndex : lastIndex)
    const nextRotateIndex = atFirstIndex ? rotateIndex + 1 : rotateIndex
    const nextHighlightedIndex = atFirstIndex ? nextIndex : highlightedIndex - 1
    
    setRotateIndex(nextRotateIndex)
    setHighlightedIndex(nextHighlightedIndex)
    
    _callIfTrue(DEBUG, () => {
      console.log(
        "| highlightedIndex:", highlightedIndex,
        "| lastIndex:", lastIndex,
        "| atFirstIndex:", atFirstIndex,
        "| nextIndex:", nextIndex,
        "| nextRotateIndex:", nextRotateIndex,
        "| nextHighlightedIndex:", nextHighlightedIndex,
      )
    })
    
    const slicedItems = isScrollable() ?
      arrRotate(items, nextRotateIndex).slice(0, getRowsToDisplay()) :
      items
    const highlightedItem: ListItem | undefined = slicedItems[nextHighlightedIndex]
    _callIfTruthy(highlightedItem, onHighlight)
  }
  
  function downarrowPressed(): void {
    DEBUG && console.log(TextColor.builder.magenta.build()("downarrowPressed"))
    
    const lastIndex = (isScrollable() ? getRowsToDisplay() : items.length) - 1
    const atLastIndex = highlightedIndex === lastIndex
    const nextIndex = (isScrollable() ? highlightedIndex : 0)
    const nextRotateIndex = atLastIndex ? rotateIndex - 1 : rotateIndex
    const nextHighlightedIndex = atLastIndex ? nextIndex : highlightedIndex + 1
    
    setRotateIndex(nextRotateIndex)
    setHighlightedIndex(nextHighlightedIndex)
    
    _callIfTrue(DEBUG, () => {
      console.log(
        "| highlightedIndex:", highlightedIndex,
        "| lastIndex:", lastIndex,
        "| atLastIndex:", atLastIndex,
        "| nextIndex:", nextIndex,
        "| nextRotateIndex:", nextRotateIndex,
        "| nextHighlightedIndex:", nextHighlightedIndex,
      )
    })
    
    const slicedItems = isScrollable() ?
      arrRotate(items, nextRotateIndex).slice(0, getRowsToDisplay()) :
      items
    const highlightedItem: ListItem | undefined = slicedItems[nextHighlightedIndex]
    _callIfTruthy(highlightedItem, onHighlight)
  }
  
  function spacePressed(): void {
    DEBUG && console.log(TextColor.builder.magenta.build()("spacePressed"))
    
    const highlightedItem: ListItem | undefined = slicedItemsToDisplay[highlightedIndex]
    _callIfTruthy(highlightedItem, toggleSelectionFor)
  }
  
  function returnPressed(): void {
    DEBUG && console.log(TextColor.builder.magenta.build()("enterPressed"))
    onSubmit(selected)
  }
  
  function deletePressed(): void {
    setSelected([])
  }
  
  function toggleSelectionFor(selectedItem: ListItem): void {
    const isSelected = isItemSelected(selected, selectedItem.key)
    
    _callIfTruthy(DEBUG, () => {
      const green = TextColor.builder.green.build()
      const red = TextColor.builder.red.build()
      console.log(
        "| selectedItem.key:", selectedItem.key,
        "| selectedItem.label:", selectedItem.label,
        "| isSelected", isSelected ? green("true") : red("false")
      )
    })
    
    return isSelected ? unselect() : select()
    
    function select(): void {
      if (singleSelectionMode && selected.length > 0) setSelected([ selectedItem ])
      else setSelected([ ...selected, selectedItem ])
      onSelect(selectedItem)
    }
    
    function unselect(): void {
      const selectedWithItemRemoved = selected.filter(it => it.key !== selectedItem.key)
      setSelected(selectedWithItemRemoved)
      onUnselect(selectedItem)
    }
  }
}

export function isItemSelected(
  selected: ListItem[],
  itemKey: string
):
  boolean {
  const arrayOfKeys = selected.map(({ key }) => key)
  const isFound = arrayOfKeys.includes(itemKey)
  return isFound
}
