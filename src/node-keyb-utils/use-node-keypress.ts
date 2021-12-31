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

import { useEffect } from "react"
import readline from "readline"

/**
 * https://nodejs.org/api/readline.html#readlineemitkeypresseventsstream-interface
 * https://www.npmjs.com/package/keypress
 */
export function useNodeKeypress() {
  const run = () => {
    readline.emitKeypressEvents(process.stdin)
    if (process.stdin.isTTY) process.stdin.setRawMode(true)
    process.stdin.on("keypress", (chunk, key) => {
      console.log("chunk", chunk)
      console.log("key", key)
      // Example of detecting a keypress:
      // if (key && key.ctrl && key.name == 'c') process.exit();
    })
  }
  
  useEffect(run, [])
}
