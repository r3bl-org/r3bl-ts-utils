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

import _ from "lodash"
import { TextColor } from "../../color-console-utils"
import { _callIfTruthy } from "../../misc-utils"
import { ListItem, OperateOnOneItemFn } from "./types"

const DEBUG = false

/** @immutable */
export class SelectionModel {
  private selected: ListItem[]
  private readonly singleSelectionMode

  // Mutator methods (all immutable).
  /** @immutable */
  constructor(initialSelected: ListItem[], singleSelectionMode: boolean) {
    this.selected = _.cloneDeep(initialSelected) // Clone the initialSelected array.
    this.singleSelectionMode = singleSelectionMode
  }

  /** @immutable */
  clearAllSelections = (): SelectionModel => {
    return new SelectionModel([], this.singleSelectionMode)
  }

  /** @immutable */
  toggleSelectionFor = (
    selectedItem: ListItem,
    onSelect: OperateOnOneItemFn,
    onUnselect: OperateOnOneItemFn
  ): SelectionModel => {
    const isSelected = this.isItemSelected(selectedItem)

    _callIfTruthy(DEBUG, () => {
      const green = TextColor.builder.green.build()
      const red = TextColor.builder.red.build()
      console.log(
        "| selectedItem.key:",
        selectedItem.key,
        "| selectedItem.label:",
        selectedItem.label,
        "| isSelected",
        isSelected ? green("true") : red("false")
      )
    })

    const addToSelected = (arg: ListItem): void => {
      this.selected.push(arg)
    }

    const removeFromSelected = (selectedItem: ListItem): void => {
      if (this.selected.includes(selectedItem))
        this.selected = this.selected.filter((it) => it.key !== selectedItem.key)
    }

    const select = (selectedItem: ListItem): void => {
      if (this.singleSelectionMode && this.selected.length > 0) {
        this.clearAllSelections()
        addToSelected(selectedItem)
      } else {
        addToSelected(selectedItem)
      }
      onSelect(selectedItem)
    }

    const unselect = (selectedItem: ListItem): void => {
      removeFromSelected(selectedItem)
      onUnselect(selectedItem)
    }

    isSelected ? unselect(selectedItem) : select(selectedItem)

    return new SelectionModel(this.selected, this.singleSelectionMode)
  }

  // Read only methods.
  /** @immutable */
  getSelection = (): ListItem[] => _.cloneDeep(this.selected)

  isItemSelected = (query: ListItem): boolean => {
    const { key: queryKey } = query
    const arrayOfKeys = this.selected.map(({ key }) => key)
    const isFound = arrayOfKeys.includes(queryKey)
    return isFound
  }

  toString = (): string => this.selected?.map(({ label }) => label).join(", ")
}
