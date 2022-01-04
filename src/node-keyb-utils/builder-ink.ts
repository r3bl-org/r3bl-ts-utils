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

import { Key } from "ink"
import { _also } from "../kotlin-lang-utils"
import { _callIfTruthy } from "../misc-utils"
import { Keypress } from "./keypress"
import { KeyCreator, ModifierKey, SpecialKey } from "./keypress-constants"

export const createFromInk = (
  argKeyNullable?: Key,
  argInputNullable?: string
): Readonly<Keypress> => {
  const copyOfArgKey: SpecialKey & ModifierKey = _also(KeyCreator.emptyKey, (emptyKey) =>
    _callIfTruthy(argKeyNullable, (argKey) => copyInkKey(argKey, emptyKey))
  )
  const inputCopy: string | undefined = argInputNullable ? argInputNullable.slice() : undefined
  return Keypress.buildImmutable(copyOfArgKey, inputCopy)
}

export const copyInkKey = (from: Key, to: SpecialKey & ModifierKey): void => {
  for (const propertyName in from)
    _also(propertyName as keyof Key, (inkPropName) => {
      if (from[inkPropName]) to[inkPropName] = Boolean(from[inkPropName])
    })
}
