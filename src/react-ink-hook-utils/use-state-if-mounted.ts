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
  Dispatch, EffectCallback, MutableRefObject, SetStateAction, useEffect, useRef, useState
} from "react"
import { _also } from "../kotlin-lang-utils"
import { StateHook } from "../react-hook-utils"

/**
 * Similar to [useState](https://reactjs.org/docs/hooks-reference.html#usestate) with this
 * change, it ensures that enclosing function component is mounted in order to update state.
 *
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 * @param initialValue Make this the initial value for state.
 * @returns An array of 2 items: the first is the current state, the second is a function that
 * enables updating the state if the component is not mounted.
 */
export const useStateIfMounted = <T>(initialValue: T): StateHook<T> => {
  const isComponentMounted = useIsComponentMounted()
  const [ state, setState ] = useState<T>(initialValue)
  
  const newSetState: Dispatch<T> = (value: T) => {
    if (isComponentMounted.current) {
      setState(value)
    }
  }
  
  return [ state, newSetState as Dispatch<SetStateAction<T>> ]
}

const useIsComponentMounted = (): MutableRefObject<boolean> =>
  _also(
    useRef(false) as ReturnType<typeof useIsComponentMounted>,
    ref => {
      const fun: EffectCallback = () => {
        ref.current = true
        // Clean up this hook.
        return () => {
          ref.current = false
        }
      }
      useEffect(fun, [])
    }
  )