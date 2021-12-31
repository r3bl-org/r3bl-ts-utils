import { Key } from "ink"
import { _also } from "../kotlin-lang-utils"
import { KeyBindingsForActions } from "../react-ink-hook-utils"
import { ModifierKey, modifierKeysPropertyNames, ReadlineKey, SpecialKey } from "./key-config-and-constants"

export const createNewShortcutsToActionMap = (): KeyBindingsForActions => new Map()

export const copyInkKey = (from: Key, to: SpecialKey & ModifierKey): void => {
  for (const propertyName in from)
    _also(
      propertyName as keyof Key,
      inkPropName => {
        if (from[inkPropName]) to[inkPropName] = Boolean(from[inkPropName])
      }
    )
}

export const copyReadlineKey = (from: ReadlineKey, to: SpecialKey & ModifierKey): void => {
  for (const propertyName of modifierKeysPropertyNames)
    if (from[propertyName]) to[propertyName] = Boolean(from[propertyName])
}
