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

import { _callIfTruthy } from "../misc-utils"
import { Keypress } from "./keypress"
import { ShortcutToActionMap } from "./use-keyboard"

// Not exported to external (via index.ts). Used in tests.

export const tryToRunActionForShortcut = (
  userInput: Readonly<Keypress>,
  map: ShortcutToActionMap
): void => {
  _callIfTruthy(map.get(userInput.toString()), (actionFn) => actionFn())
}