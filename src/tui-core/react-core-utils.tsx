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
import { Dispatch, SetStateAction } from "react"

// State helpers.

/*
 * Useful type function to describe array returned by `React.useState()`.
 */
export type SetState<T> = Dispatch<SetStateAction<T>>
export type StateHook<T> = [T, SetState<T>]

export class StateHolder<T> {
  constructor(readonly value: T, readonly setValue: SetState<T>) {}

  static createFromArray<T>(stateHook: StateHook<T>) {
    return new StateHolder(stateHook[0], stateHook[1])
  }

  asArray = (): StateHook<T> => [this.value, this.setValue]
  toString = () => JSON.stringify(this.value)
}

// React.useRef() helpers.

export type ReactRef<T> = React.MutableRefObject<T | undefined>
export type ReactRefReceiverFn<T> = (it: T) => void

/**
 * @param refObject its `current` property is value of `it`
 * @param receiverFn lambda that accepts `it`; only runs if `refObject.current` property is truthy
 * @return refObject return the refObject that is passed
 */
export const _withRef= <T,>(
  refObject: ReactRef<T>,
  receiverFn: ReactRefReceiverFn<T>
): ReactRef<T> => {
  if (refObject.current) receiverFn(refObject.current)
  return refObject
}

// Other React hook helpers.

/*
 * More info - https://stackoverflow.com/a/68602854/2085356.
 */
export function useForceUpdateFn(): () => void {
  const [_, setValue]: StateHook<boolean> = React.useState<boolean>(false)
  return () => setValue((value) => !value)
}

export const emptyArray = (): JSX.Element[] => new Array<JSX.Element>()
export type RenderItemFn<T> = (input: T, index: number) => JSX.Element
export const makeReactElementFromArray = <T, >(
  inputsArray: T[],
  itemRendererFn: RenderItemFn<T>
): JSX.Element => {
  const outputArray = emptyArray()
  inputsArray.forEach(
    (input: T, index: number) => outputArray.push(itemRendererFn(input, index))
  )
  return <>{outputArray}</>
}