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

import EventEmitter from "events"
import React, { useEffect } from "react"
import { _callIfTrueWithReturn, _callIfTruthy, _callIfTruthyWithReturn } from "../lang-utils/expression-lang-utils"
import { IsActive, NodeJsListenerFn } from "./nodejs-types"
import { SetState } from "./react-core-utils"
import { useStateSafely } from "./use-state-safely"

/**
 * In React, emitters can't invoke callback functions that are part of a function component.
 * Even though hooks look like normal functions, there are lots of restrictions on them. A big
 * one is that only React function components can call hooks. This leads to a problem that shows
 * up when you need to have an external (to React) event emitter generate an event that needs to
 * be dispatched to a function component. This emitter can't directly call into React code!
 *
 * The solution is using this hook as an intermediary / proxy. Internally, this hook maintains a
 * state that gets updated by the external (to React) emitter, and then an effect (which marks
 * this as a dependency) that actually calls into your React component callback function. This
 * article on developerlife.com explains this in much greater detail:
 * http://developerlife.com/2021/10/19/react-hooks-redux-typescript-handbook/#custom-hooks
 *
 * Here are some more resources related to this:
 * https://stackoverflow.com/questions/53898810/executing-async-code-on-update-of-state-with-react-hooks
 * https://github.com/r3bl-org/r3bl-ts-utils/commit/a3248540ea325d3896ee56a84d003f15529169cd
 * https://github.com/r3bl-org/r3bl-ts-utils/commit/1f3cbb2b4988f44c6ea48233db1730e10f18dc60
 */

export const useEventEmitter = (
  emitter: EventEmitter,
  eventName: string,
  eventHandler: NodeJsListenerFn,
  options: IsActive
) => {
  const [event, setEvent] = useStateSafely<any[] | undefined>(undefined).asArray()

  useEffect(() => manageListenerForEmitterEffectFn(options, setEvent), [options.isActive])

  useEffect(() => {
    _callIfTruthy(event, eventHandler)
  }, [event])

  function manageListenerForEmitterEffectFn(
    options: IsActive,
    setEvent: SetState<any>
  ): ReturnType<React.EffectCallback> {
    const attachedListenerFn: NodeJsListenerFn | undefined = _callIfTrueWithReturn(
      options.isActive,
      () => {
        const listener = (args: any[]) => {
          setEvent(args)
        }
        emitter.on(eventName, listener)
        return listener
      },
      () => {
        return undefined
      }
    )
    return _callIfTruthyWithReturn(
      attachedListenerFn,
      (listener) => {
        return () => {
          emitter.removeListener(eventName, listener)
        }
      },
      () => {
        return undefined
      }
    )
  }
}
