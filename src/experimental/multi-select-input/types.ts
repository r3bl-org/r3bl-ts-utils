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

import * as React from "react"
import { Data, generateUID } from "../../misc-utils"

/**
 * Props for custom indicator component.
 */
export type IndicatorProps = { isHighlighted: boolean }

/**
 * Props for custom check box component.
 */
export type CheckBoxProps = { isSelected: boolean }

/** Props for custom item component. */
export type ItemProps = {
  label: string
  isHighlighted: boolean
};

export class ListItem extends Data {
  constructor(
    readonly label: string,
    readonly value?: any,
    readonly key: string = generateUID(),
  ) {
    super()
  }
  
  static createFromArray(array: string[]) {
    return array.map(value => new ListItem(value))
  }
}

export type OperateOnOneItemFn = (item: ListItem) => void
export type OperateOnManyItemsFn = (items: ListItem[]) => void

export type MultiSelectInputProps = {
  /** Items to display in a list. Each item must be an object and have `label`. */
  items: ListItem[];
  
  /** Enable or disable whether this component can accept user input via keyboard. */
  hasFocus?: boolean;
  
  /** Limit the max number of items to display. */
  maxRows?: number;
  
  /** Items set as selected by default. */
  initialSelected?: ListItem[];
  
  /** Index of initially highlighted item in `items` array. */
  initialHighlightedIndex?: number;
  
  /** Function to call when user selects an item. */
  onSelect?: OperateOnOneItemFn;
  
  /** Function to call when user's cursor is over an item. */
  onHighlight?: OperateOnOneItemFn;
  
  /** Function to call when user unselects an item. */
  onUnselect?: OperateOnOneItemFn;
  
  /** Function to call when user submits selected items. */
  onSubmit?: OperateOnManyItemsFn;
  
  /** Custom component to override the default indicator component. */
  indicatorComponent?: React.ComponentType<IndicatorProps>;
  
  /** Custom component to override the default check box component. */
  checkboxComponent?: React.ComponentType<CheckBoxProps>;
  
  /** Custom component to override the default item component. */
  itemComponent?: React.ComponentType<ItemProps>;
};
