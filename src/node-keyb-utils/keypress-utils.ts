/*
 * Copyright 2022 R3BL LLC. All rights reserved.
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

import { ShortcutToActionMap } from "../react-ink-hook-utils"
import { ModifierKey, SpecialKey } from "./keypress-constants"

export const createNewShortcutToActionMap = (): ShortcutToActionMap => new Map()

// https://developerlife.com/2021/07/02/nodejs-typescript-handbook/#user-defined-type-guards
export const isKeyType = (param: any): param is SpecialKey & ModifierKey => {
  const key = param as SpecialKey & ModifierKey
  return (
    key.upArrow !== undefined &&
    key.downArrow !== undefined &&
    key.leftArrow !== undefined &&
    key.rightArrow !== undefined &&
    key.pageDown !== undefined &&
    key.pageUp !== undefined &&
    key.return !== undefined &&
    key.escape !== undefined &&
    key.ctrl !== undefined &&
    key.shift !== undefined &&
    key.tab !== undefined &&
    key.backspace !== undefined &&
    key.delete !== undefined &&
    key.meta !== undefined
  )
}