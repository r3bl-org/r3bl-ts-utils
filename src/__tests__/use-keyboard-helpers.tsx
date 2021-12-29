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

export const delay = (timeMs: number) => new Promise<void>((resolveFn) => {
  setTimeout(() => {
    resolveFn()
  }, timeMs)
})

export class Flag {
  flag = false
  isSet = () => this.flag
  set = () => this.flag = true
}

// Constants for useKeyboard.

// Special keys.

export const upKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: true, // 👍
}

export const downKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: true, // 👍
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: false
}

export const leftKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: true, // 👍
  meta: false,
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: false,
}

export const rightKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: true, // 👍
  shift: false,
  tab: false,
  upArrow: false,
}

export const pageUpKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: true, // 👍
  return: false,
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: false,
}

export const pageDownKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: true, // 👍
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: false,
}

export const escapeKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: true, // 👍
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: false,
}

export const returnKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: false,
  return: true, // 👍
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: false,
}

export const tabKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: false,
  tab: true, // 👍
  upArrow: false,
}

export const backspaceKey = {
  backspace: true, // 👍
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: false,
}

export const deleteKey = {
  backspace: false,
  ctrl: false,
  delete: true, // 👍
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: false,
}

// Modifier keys.

export const ctrlKey = {
  backspace: false,
  ctrl: true, // 👍
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: false,
}

export const metaKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: true, // 👍
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: false,
  tab: false,
  upArrow: false,
}

export const shiftKey = {
  backspace: false,
  ctrl: false,
  delete: false,
  downArrow: false,
  escape: false,
  leftArrow: false,
  meta: false,
  pageDown: false,
  pageUp: false,
  return: false,
  rightArrow: false,
  shift: true, // 👍
  tab: false,
  upArrow: false,
}

