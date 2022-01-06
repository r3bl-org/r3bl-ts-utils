/*
 * Copyright (c) 2021-2022 R3BL LLC. All rights reserved.
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

import { Box, render, Text, useApp } from "ink"
import React, { FC } from "react"
import {
  _also, createNewShortcutToActionMap, LifecycleHelper, ShortcutToActionMap, TextColor,
  TimerRegistry, UseKeyboardReturnValue, useKeyboardWithMapCached,
} from "../index"

// Types & data classes.

type HookInput = { name: string }
type HookOutput = {
  useKeyboard: UseKeyboardReturnValue,
  greeting: string
}
type InternalProps = { ctx: HookOutput }

// Hooks.

const runHooks = (input: HookInput): HookOutput => {
  const { name } = input
  const app = useApp()
  const createShortcutsFn = (): ShortcutToActionMap =>
    _also(
      createNewShortcutToActionMap(),
      map => map
        .set("q", app.exit)
        .set("ctrl+q", app.exit)
        .set("x", app.exit)
        .set("ctrl+x", app.exit)
    )
  return {
    greeting: TextColor.builder.rainbow.build()(name),
    useKeyboard: useKeyboardWithMapCached(createShortcutsFn)
  }
}

// Function component.

const App: FC = () => {
  const output = runHooks({ name: "Your example goes here!" })
  const { greeting } = output
  return (
    <Box flexDirection="column">
      <Row_Debug ctx={output}/>
      <Text>{greeting}</Text>
    </Box>
  )
}

const Row_Debug: FC<InternalProps> = ({ ctx }) => {
  const { keyPress: kp, inRawMode: mode } = ctx.useKeyboard
  return mode ?
    <Text color="magenta">keyPress: {kp ? `${kp.toString()}` : "n/a"}</Text> :
    <Text color="gray">keyb disabled</Text>
}

// Main.
const main = async (): Promise<void> => {
  const instance = render(<App/>)
  
  LifecycleHelper.addExitListener(() => {
    TimerRegistry.killAll()
    instance.unmount()
  })
  
  try {
    await instance.waitUntilExit()
    console.log(TextColor.builder.bgYellow.black.build()("Exiting ink"))
  } catch (err) {
    console.error(TextColor.builder.bgYellow.black.build()("Problem with exiting ink"))
  }
}

main().catch(console.log)
