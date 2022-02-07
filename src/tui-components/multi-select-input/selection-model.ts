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

import { _callIfTruthy } from "../../lang-utils/expression-lang-utils"
import { TextColor } from "../../tui-colors"
import { ListItem, OperateOnOneItemFn } from "./types"

const DEBUG = false

/** @immutable */
export class SelectionModel {
  private selected: Set<ListItem>
  private readonly singleSelectionMode: boolean

  // Mutator methods (all immutable).
  /** @immutable */
  constructor(initialSelected: ListItem[], singleSelectionMode: boolean) {
    this.selected = new Set(initialSelected) // Make shallow copy.
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
      this.selected.add(arg)
    }

    const removeFromSelected = (selectedItem: ListItem): void => {
      this.selected.delete(selectedItem)
    }

    const select = (selectedItem: ListItem): void => {
      if (this.singleSelectionMode && this.selected.size > 0) {
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

    return new SelectionModel(this.getSelection(), this.singleSelectionMode)
  }

  // Read only methods.
  /** 
   * @immutable 
   * https://stackoverflow.com/a/20070691/2085356
  */
  getSelection = (): ListItem[] => [ ...this.selected ] // Return shallow copy.

  isItemSelected = (query: ListItem): boolean => {
    return this.selected.has(query)
  }

  toString = (): string => this.getSelection()
    .map(({ label }) => label)
    .join(", ")
}
