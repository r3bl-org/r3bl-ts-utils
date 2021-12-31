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

import { Box, render, Text } from "ink"
import React, { FC, useMemo } from "react"
import {
  _also, createNewShortcutsToActionMap, KeyBindingsForActions, LifecycleHelper, TimerRegistry,
  TTYSize, useClockWithLocalTimeFormat, useKeyboardWithMap, usePreventProcessExitDuringTesting,
  UserInputKeyPress, useTTYSize,
} from "../../index"

namespace nodejs_keypress_ink { // eslint-disable-line
  //#region Hooks.
  
  interface RenderContext {
    ttySize: TTYSize
    inRawMode: boolean
    formattedTime: string
    name: string
    keyPress: UserInputKeyPress | undefined
  }
  
  const runHooks = (name: string): RenderContext => {
    usePreventProcessExitDuringTesting() // For testing using `npm run start-dev-watch`.
    const ttySize: TTYSize = useTTYSize()
    const { localeTimeString: formattedTime } = useClockWithLocalTimeFormat(3_000)
    
    const map: KeyBindingsForActions = useMemo(() => createShortcutsMap(), [])
    const { keyPress, inRawMode } = useKeyboardWithMap(map)
    
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
  
  const createShortcutsMap = (): KeyBindingsForActions => _also(
    createNewShortcutsToActionMap(),
    map => map
      .set([ "q", "ctrl+q", "escape" ], LifecycleHelper.fireExit)
  )
  
  //#endregion
  
  //#region render().
  
  const App: FC = () => {
    const { keyPress, name, inRawMode, ttySize, formattedTime } = runHooks("Grogu")
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
      </Box>
    )
  }
  
  //#endregion
  
  //#region main().
  
  export const main = () => {
    const instance = render(<App/>)
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

nodejs_keypress_ink.main()