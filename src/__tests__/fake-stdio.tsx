/* eslint-disable */

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

import EventEmitter from "events"

// https://github.com/maurocarrero/sinon-jest-cheatsheet#create-spies
// https://github.com/nazmulidris/ink/blob/deb9d9653f3f558ea0d16c64581bd37691c749e2/test/focus.tsx#L94
// https://github.com/nazmulidris/ink/blob/155e1a042b12e82929bdb26571385b5dea0f0b39/test/helpers/create-stdout.ts#L20-L19

interface Stream extends EventEmitter {
  output: string;
  columns: number;
  write(str: string): void;
  get(): string;
}

export const createStdout = (columns?: number): Stream => {
  const stdout = new EventEmitter() as any
  stdout.columns = columns ?? 100
  stdout.write = jest.fn()
  stdout.get = () => stdout.write.lastCall.args[0]
  
  return stdout
}
export const createStdin = () => {
  const stdin = new EventEmitter() as any
  stdin.isTTY = true
  stdin.setRawMode = jest.fn()
  stdin.setEncoding = () => {}
  stdin.resume = () => {}
  stdin.pause = () => {}
  return stdin
}
