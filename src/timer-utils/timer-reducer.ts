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

import { State, TimerErrors } from "./externals"
import { TimerInternal } from "./internals"

interface StartAction {
  type: "start"
  startTime: number
}

interface StopAction {
  type: "stop"
  stopTime: number
}

export type Actions = StartAction | StopAction

type ReducerFnType = (timer: TimerInternal, currentState?: State, action?: Actions) => State

/**
 * @throws TimerErrors
 */
export const reducerFn: ReducerFnType = (
  timer: TimerInternal,
  currentState?: State,
  action?: Actions
): State => {
  if (!currentState)
    return {
      runtimeStatus: "created_not_started",
      startTime: 0,
      stopTime: 0,
    }

  const { runtimeStatus } = currentState
  const {
    CantStart_AlreadyStopped,
    CantStart_AlreadyRunning,
    CantStop_AlreadyStopped,
    CantStop_NotStarted,
  } = TimerErrors

  if (action)
    switch (action.type) {
      case "start":
        if (runtimeStatus === "created_not_started") return startFn(timer, currentState, action)
        if (runtimeStatus === "stopped") throw CantStart_AlreadyStopped
        if (runtimeStatus === "running") throw CantStart_AlreadyRunning
        break
      case "stop":
        if (runtimeStatus === "created_not_started") throw CantStop_NotStarted
        if (runtimeStatus === "stopped") throw CantStop_AlreadyStopped
        if (runtimeStatus === "running") return stopFn(timer, currentState, action)
        break
    }

  return currentState
}

function stopFn(timer: TimerInternal, currentState: State, action: StopAction): State {
  timer.actuallyStop()
  return { ...currentState, runtimeStatus: "stopped", stopTime: action.stopTime }
}

function startFn(timer: TimerInternal, currentState: State, action: StartAction): State {
  timer.actuallyStart()
  return {
    ...currentState,
    runtimeStatus: "running",
    startTime: action.startTime,
  }
}
