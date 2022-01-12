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
import React, { FC } from "react"
import { _callIfTrue, _callIfTruthy, TextColor, useKeyboard, useStateSafely } from "../../index"
import { CheckBox } from "./checkbox"
import { Indicator } from "./indicator"
import { Item } from "./item"
import { ListItem, MultiSelectInputProps } from "./types"
import { arrRotate } from "./utils"

const DEBUG = false

export const MultiSelectInput: FC<MultiSelectInputProps> = ({
  items,
  maxRows = -1,
  initialHighlightedIndex = 0,
  initialSelected = new Array<ListItem>(),
  hasFocus = true,
  indicatorComponent = Indicator,
  itemComponent = Item,
  checkboxComponent = CheckBox,
  onHighlight,
  onSelect,
  onUnselect,
  onSubmit,
  testing
}) => {
  // Generate state from props.
  const [ rotateIndex, setRotateIndex ] = useStateSafely(0).asArray()
  const [ highlightedIndex, setHighlightedIndex ] =
    useStateSafely(initialHighlightedIndex).asArray()
  const [ selected, setSelected ] = useStateSafely(initialSelected).asArray()
  
  // Check whether scrolling is active and item needs to be sliced based on "viewport".
  const isScrollActive = isScrollable()
  const slicedItemsToDisplay = sliceItemsIfScrollable()
  
  // Wire up keyboard shortcuts.
  useKeyboard(
    keypress => {
      if (keypress.matches("return")) returnPressed()
      if (keypress.matches("downarrow")) downarrowPressed()
      if (keypress.matches("uparrow")) uparrowPressed()
      if (keypress.matches("space")) spacePressed()
    },
    { isActive: hasFocus },
    testing
  )
  
  return (
    <Box flexDirection="column">
      {slicedItemsToDisplay.map(
        (item: ListItem, index: number) =>
          renderListItem(item, index))}
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
        {React.createElement(checkboxComponent, { isSelected })}
        {React.createElement(itemComponent, { label, isHighlighted })}
      </Box>
    )
  }
  
  function sliceItemsIfScrollable(): ListItem[] {
    return isScrollable() ? arrRotate(items, rotateIndex).slice(0, getRowsToDisplay()) : items
  }
  
  function isScrollable(): boolean {
    return maxRows !== -1 && items.length > maxRows
  }
  
  function getRowsToDisplay(): number {
    return maxRows === -1 ? items.length : maxRows
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
    
    if (onHighlight) {
      const slicedItems = isScrollable() ?
        arrRotate(items, nextRotateIndex).slice(0, getRowsToDisplay()) : items
      const highlightedItem: ListItem | undefined = slicedItems[nextHighlightedIndex]
      if (highlightedItem) onHighlight(highlightedItem)
    }
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
    
    if (onHighlight) {
      const slicedItems = isScrollable() ?
        arrRotate(items, nextRotateIndex).slice(0, getRowsToDisplay()) : items
      const highlightedItem: ListItem | undefined = slicedItems[nextHighlightedIndex]
      if (highlightedItem) onHighlight(highlightedItem)
    }
  }
  
  function spacePressed(): void {
    DEBUG && console.log(TextColor.builder.magenta.build()("spacePressed"))
    
    const highlightedItem: ListItem | undefined = slicedItemsToDisplay[highlightedIndex]
    if (highlightedItem) toggleSelectionFor(highlightedItem)
  }
  
  function returnPressed(): void {
    DEBUG && console.log(TextColor.builder.magenta.build()("enterPressed"))
    
    if (onSubmit && selected) onSubmit(selected)
  }
  
  function toggleSelectionFor(selectedItem: ListItem): void {
    const isSelected = isItemSelected(selected, selectedItem.key)
    
    _callIfTruthy(DEBUG, () => {
      console.log(
        "| selectedItem.key:", selectedItem.key,
        "| selectedItem.label:", selectedItem.label,
        "| isSelected", isSelected ?
          TextColor.builder.green.build()("true") : TextColor.builder.red.build()("false")
      )
    })
    
    return isSelected ? unselect() : select()
    
    function select(): void {
      _callIfTruthy(onSelect, onSelect => onSelect(selectedItem))
      setSelected([ ...selected, selectedItem ])
    }
    
    function unselect(): void {
      _callIfTruthy(onUnselect, onUnselect => onUnselect(selectedItem))
      const selectedWithItemRemoved = selected.filter(it => it.key !== selectedItem.key)
      setSelected(selectedWithItemRemoved)
    }
  }
  
}

export function isItemSelected(
  selected: ListItem[],
  itemKey: string
):
  boolean {
  const arrayOfKeys = selected.map(({ key }) => key)
  const isFound: boolean = arrayOfKeys.includes(itemKey)
  return isFound
}
