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
import { render } from "ink"
import { TimerRegistry } from "../timer-utils"
import { TextColor } from "../tui-colors"

/**
 * Launches a CLI app. This is the "bootloader" equivalent for a CLI app.
 *
 * If you have any event listeners attached (eg, using `useKeyboard()`, or `useNodeKeypress()`) then
 * your app won't exit if you don't call `LifecycleHelper.fireExit()`.
 *
 * Usage example:
 * ```tsx
 * const App:FC = ()=> {
 *   const createShortcutsFn = (): ShortcutToActionMap =>
 *     _also(
 *       createNewShortcutToActionMap(),
 *       map => map.set("q", LifecycleHelper.fireExit)
 *     )
 *   useKeyboardWithMapCached(createShortcutsFn)
 *   return( <Text>"Hello"</Text> )
 * }
 *
 * inkCLIAppMainFn( ()=>{
 *   const args = processCommandLineArgs()
 *   return createInkApp(args)
 * } ).catch(console.error)
 * ```
 *
 * @param {() => ReturnType<typeof render>} runFn Do what you need to create an Ink instance
 * @param okExitMsg If non empty string (truthy) display this on exit w/out errors
 * @param errExitMsg If non empty string (truthy) display this on exit w/ errors
 * @return {Promise<void>} Optionally attach a catch block to this promise
 */
export const inkCLIAppMainFn = async (
  runFn: () => ReturnType<typeof render>,
  okExitMsg = "",
  errExitMsg = ""
): Promise<void> => {
  const instance = runFn()

  LifecycleHelper.addExitListener(() => {
    TimerRegistry.killAll()
    instance.unmount()
  })

  try {
    await instance.waitUntilExit()
    if (okExitMsg) console.log(TextColor.builder.bgYellow.black.build()(okExitMsg))
  } catch (err) {
    if (errExitMsg) console.error(TextColor.builder.bgYellow.black.build()(errExitMsg))
  }
}

// LifecycleHelper.

type EventName = "exit" | "start"
type EventListener = (name: EventName) => void

export class LifecycleHelper extends EventEmitter {
  static instance = new LifecycleHelper()

  static addStartListener = (listener: EventListener) => this.instance.on("start", listener)
  static addExitListener = (listener: EventListener) => this.instance.on("exit", listener)

  static fireExit = () => this.instance.emit("exit")
  static fireStart = () => this.instance.emit("start")

  static removeAll = () => this.instance.removeAllListeners()
}
