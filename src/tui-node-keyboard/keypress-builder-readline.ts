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

import { _also } from "../lang-utils/kotlin-lang-utils"
import { _callIfTruthy, _callIfTruthyWithReturn } from "../lang-utils/expression-lang-utils"
import { Keypress } from "./keypress"
import {
  KeyCreator,
  ModifierKey,
  modifierKeysPropertyNames,
  SpecialKey,
} from "./keypress-constants"
import { keyCodeMap, keyNameMap, keySequenceMap, ReadlineKey } from "./readline-config"

export const createFromKeypress = (
  nullableKey?: ReadlineKey,
  nullableInput?: string
): Readonly<Keypress> => {
  // Is it a special key (w/ or w/out modifiers)?
  const specialKey = tryToFindSpecialKeyInMap(nullableKey)
  if (specialKey) return specialKey

  // Is it a regular key w/ modifiers?
  const regularKeyWithModifiers = tryToCreateRegularKeyWithModifiers(nullableKey)
  if (regularKeyWithModifiers) return regularKeyWithModifiers

  // Must be just a regular key.
  return createRegularKey(nullableKey, nullableInput)
}

/**
 * First search key.code, then key.name, and finally key.sequence.
 */
const tryToFindSpecialKeyInMap = (key: ReadlineKey | undefined): Readonly<Keypress> | undefined => {
  if (!key) return undefined

  let nullableReturnValue: Keypress | undefined = undefined

  // Check key.code first.
  if (key.code)
    for (const [partialSequence, keyPressFn] of keyCodeMap.entries()) {
      if (key.code.includes(partialSequence)) {
        nullableReturnValue = keyPressFn()
        break
      }
    }

  // Check key.name second (if key.code not matched).
  if (!nullableReturnValue && key.name)
    _callIfTruthy(keyNameMap.get(key.name), (fun) => (nullableReturnValue = fun()))

  // Check key.sequence third (if key.code & key.name not matched).
  if (!nullableReturnValue && key.sequence)
    for (const [partialSequence, keyPressFn] of keySequenceMap.entries()) {
      if (key.sequence.includes(partialSequence)) {
        nullableReturnValue = keyPressFn()
        break
      }
    }

  // Check for modifiers to be set.
  return _callIfTruthyWithReturn(
    nullableReturnValue,
    (returnValue) => _also(returnValue, () => applyModifierKeysTo(key, returnValue._key)),
    () => undefined
  )
}

const tryToCreateRegularKeyWithModifiers = (
  key: ReadlineKey | undefined
): Readonly<Keypress> | undefined => {
  if (!key) return undefined

  // Special handling for ctrl and meta -> "input" is undefined but "key.name" has the input.
  // No special handling needed for shift.
  if (key.ctrl || key.meta) return createRegularKey(key, key.name)
  else return undefined
}

const createRegularKey = (
  nullableKey: ReadlineKey | undefined,
  nullableInput: string | undefined
): Readonly<Keypress> => {
  const newKey: SpecialKey & ModifierKey = _also(KeyCreator.emptyKey, (emptyKey) =>
    _callIfTruthy(nullableKey, (key) => applyModifierKeysTo(key, emptyKey))
  )
  const inputCopy: string | undefined = nullableInput ? nullableInput.slice() : undefined
  return Keypress.buildImmutable(newKey, inputCopy)
}

/**
 * @param {ReadlineKey} source Get shift, meta, ctrl information from this
 * @param {Keypress} target Apply the information to this
 * @return {Keypress} modified target
 */
const applyModifierKeysTo = (
  source: ReadlineKey,
  target: (SpecialKey & ModifierKey) | undefined
): void => {
  for (const propertyName of modifierKeysPropertyNames)
    if (source[propertyName] && target) target[propertyName] = Boolean(source[propertyName])
}
