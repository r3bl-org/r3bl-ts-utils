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

import React from "react"

// Misc React helpers.

export const emptyArray = (): JSX.Element[] => new Array<JSX.Element>()

export type RenderItemFn<T> = (input: T, index: number) => JSX.Element

export const makeReactElementFromArray = <T extends any>(
  inputsArray: T[],
  itemRendererFn: RenderItemFn<T>
): JSX.Element => {
  const outputArray = emptyArray()
  inputsArray.forEach(
    (input: T, index: number) => outputArray.push(itemRendererFn(input, index))
  )
  return <>{outputArray}</>
}
