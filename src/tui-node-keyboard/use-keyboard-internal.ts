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

import { _callIfTruthy } from "../lang-utils/expression-lang-utils"
import { _callIfSome } from "../lang-utils/rust-lang-utils"
import { KeypressOption, ShortcutToActionMap } from "./use-keyboard"

// Not exported to external (via index.ts). Used in tests.

export const tryToRunActionForShortcut = (
  keypressOption: KeypressOption,
  map: ShortcutToActionMap
): void => {
  _callIfSome(keypressOption, keypress => {
    _callIfTruthy(map.get(keypress.toString()), (actionFn) => actionFn())
  })
}
