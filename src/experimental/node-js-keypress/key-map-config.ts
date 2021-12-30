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

import {
  _also, backspaceKey, deleteKey, downKey, leftKey, pageDownKey, pageUpKey, returnKey, rightKey,
  tabKey, UserInputKeyPress
} from "../../index"

export const keyCodeMap = _also(
  new Map<string, UserInputKeyPress>(),
  map => {
    map
      .set("[D", new UserInputKeyPress(leftKey, undefined))
      .set("[C", new UserInputKeyPress(rightKey, undefined))
      .set("[A", new UserInputKeyPress(rightKey, undefined))
      .set("[B", new UserInputKeyPress(downKey, undefined))
      .set("[6~", new UserInputKeyPress(pageDownKey, undefined))
      .set("[5~", new UserInputKeyPress(pageUpKey, undefined))
  }
)

export const keySequenceMap = _also(
  new Map<string, UserInputKeyPress>(),
  map => {
    map
      .set("7F", new UserInputKeyPress(backspaceKey, undefined))
      .set("[3~", new UserInputKeyPress(deleteKey, undefined))
      .set("\r", new UserInputKeyPress(returnKey, undefined))
      .set("\t", new UserInputKeyPress(tabKey, undefined))
  }
)

export const keyNameMap = _also(
  new Map<string, UserInputKeyPress>(),
  map => {
    map
      .set("backspace", new UserInputKeyPress(backspaceKey, undefined))
      .set("delete", new UserInputKeyPress(deleteKey, undefined))
      .set("return", new UserInputKeyPress(returnKey, undefined))
      .set("tab", new UserInputKeyPress(tabKey, undefined))
  }
)
