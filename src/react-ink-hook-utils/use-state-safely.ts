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

import { EffectCallback, useEffect, useRef, useState } from "react"
import { _also } from "../kotlin-lang-utils"
import { _callIfTruthy } from "../misc-utils"
import { ReactRef, SetState, StateHolder } from "../react-hook-utils"

/**
 * Similar to [useState](https://reactjs.org/docs/hooks-reference.html#usestate) with some changes:
 * 1. Ensures that enclosing function component is mounted in order to update state.
 * 2. Returns an object instead of an array.
 *
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 * @param initialValue Make this the initial value for state.
 * @returns An object containing 2 items: the state, and a function that enables updating the
 * state if the component is not mounted.
 */
export const useStateSafely = <T>(initialValue: T): StateHolder<T> => {
  const isComponentMounted: ReactRef<boolean> = useIsComponentMounted()
  const [ state, setState ] = useState<T>(initialValue)
  
  // https://stackoverflow.com/a/41085908/2085356
  const setStateOverride = (value: T) =>
    _callIfTruthy(isComponentMounted.current, (_) => setState(value))
  
  return new StateHolder(state, setStateOverride as SetState<T>)
}

/**
 * Runs an effect just once (onComponentDidMount) which sets the ref (that's returned) to true when
 * the component is mounted. And false when it isn't (hasn't been mounted yet, or has been
 * unmounted).
 */
export const useIsComponentMounted = (): ReactRef<boolean> =>
  _also(useRef(false) as ReactRef<boolean>, (ref) => {
    const runOnMount: EffectCallback = () => {
      ref.current = true
      // Clean up this hook.
      const cleanUpFn = () => {
        ref.current = false
      }
      return cleanUpFn
    }
    useEffect(runOnMount, [])
  })
