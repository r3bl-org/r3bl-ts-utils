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

// TODO move to nodejs-keyb-utils

import { _also, KeyCreator, UserInputKeyPress } from "../../index"

export const keyCodeMap = _also(
  new Map<string, UserInputKeyPress>(),
  map => {
    map
      .set("[D", UserInputKeyPress.createCopyOf(KeyCreator.leftKey, undefined))
      .set("[C", UserInputKeyPress.createCopyOf(KeyCreator.rightKey, undefined))
      .set("[A", UserInputKeyPress.createCopyOf(KeyCreator.rightKey, undefined))
      .set("[B", UserInputKeyPress.createCopyOf(KeyCreator.downKey, undefined))
      .set("[6~", UserInputKeyPress.createCopyOf(KeyCreator.pageDownKey, undefined))
      .set("[5~", UserInputKeyPress.createCopyOf(KeyCreator.pageUpKey, undefined))
  }
)

export const keySequenceMap = _also(
  new Map<string, UserInputKeyPress>(),
  map => {
    map
      .set("7F", UserInputKeyPress.createCopyOf(KeyCreator.backspaceKey, undefined))
      .set("[3~", UserInputKeyPress.createCopyOf(KeyCreator.deleteKey, undefined))
      .set("\r", UserInputKeyPress.createCopyOf(KeyCreator.returnKey, undefined))
      .set("\t", UserInputKeyPress.createCopyOf(KeyCreator.tabKey, undefined))
  }
)

export const keyNameMap = _also(
  new Map<string, UserInputKeyPress>(),
  map => {
    map
      .set("backspace", UserInputKeyPress.createCopyOf(KeyCreator.backspaceKey, undefined))
      .set("delete", UserInputKeyPress.createCopyOf(KeyCreator.deleteKey, undefined))
      .set("return", UserInputKeyPress.createCopyOf(KeyCreator.returnKey, undefined))
      .set("tab", UserInputKeyPress.createCopyOf(KeyCreator.tabKey, undefined))
  }
)
