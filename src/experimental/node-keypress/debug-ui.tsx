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

import { Box, render, Text, useInput } from "ink"
import React, { FC, useState } from "react"
import {
  _also, createNewShortcutToActionMap, Keypress, LifecycleHelper, ShortcutToActionMap, StateHook,
  TimerRegistry, TTYSize, useClockWithLocalTimeFormat, useKeyboardBuilder,
  usePreventProcessExitDuringTesting, useTTYSize,
} from "../../index"

// Unique namespace ensures there will be no unintended collisions w/ other symbols of the codebase.
export namespace keyboard_debug_ui { // eslint-disable-line
  //#region Hooks.
  interface RenderContext {
    ttySize: TTYSize
    inRawMode: boolean
    formattedTime: string
    name: string
    keyPress: Readonly<Keypress> | undefined
  }
  
  const runHooks = (name: MainParams): RenderContext => {
    usePreventProcessExitDuringTesting() // For testing using `npm run start-dev-watch`.
    const ttySize: TTYSize = useTTYSize()
    const { localeTimeString: formattedTime } = useClockWithLocalTimeFormat(3_000)
    const { keyPress, inRawMode } =
      useKeyboardBuilder({ type: name, args: { type: "map-cached", createShortcutsFn } })
    
    return {
      name,
      ttySize,
      formattedTime,
      inRawMode,
      keyPress
    }
  }
  //#endregion
  
  //#region handleKeyboard.
  const createShortcutsFn = (): ShortcutToActionMap => _also(
    createNewShortcutToActionMap(),
    map => map
      .set("q", LifecycleHelper.fireExit)
      .set("ctrl+q", LifecycleHelper.fireExit)
      .set("escape", LifecycleHelper.fireExit)
  )
  //#endregion
  
  //#region Function component.
  const App: FC<{ arg: MainParams }> = ({ arg }) => {
    const { keyPress, name, inRawMode, ttySize, formattedTime } = runHooks(arg)
    return (
      <Box flexDirection={"column"}>
        <Text>
          Hello <Text color="yellow">{name}</Text>
        </Text>
        <Text>
          {inRawMode ?
            <Text color="green">inRawMode</Text> :
            <Text color="red">!inRawMode</Text>
          }
        </Text>
        <Text>
          ttySize <Text color="blue">{ttySize.toString()}</Text>
        </Text>
        <Text>
          time <Text color="magenta">{formattedTime}</Text>
        </Text>
        <Text>
          {keyPress ?
            <Text color="cyan">{keyPress.toString()}</Text> :
            <Text color="red">!keyPress</Text>
          }
        </Text>
        <UserInput/>
      </Box>
    )
  }
  const UserInput: FC = () => {
    const [ input, setInput ]: StateHook<string> = useState("")
    useInput((input, _) => setInput(input))
    return <Text color="gray">useInput: {input}</Text>
  }
  
  //#endregion
  
  //#region main().
  type MainParams = "node-keypress" | "ink-compat"
  export const main = (arg: MainParams) => {
    const instance = render(<App arg={arg}/>)
    LifecycleHelper.addExitListener(() => {
      instance.waitUntilExit()
        .then(() => {
          console.log("Exiting ink")
        })
        .catch(() => {
          console.error("Problem with exiting ink")
        })
      TimerRegistry.killAll()
      instance.unmount()
    })
  }
  //#endregion
}
