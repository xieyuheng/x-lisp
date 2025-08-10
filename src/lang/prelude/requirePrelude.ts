import { modOwnDefinitions, type Mod } from "../mod/index.ts"
import { usePreludeMod } from "./usePreludeMod.ts"

export function requirePrelude(mod: Mod) {
  const preludeMod = usePreludeMod()
  for (const definition of modOwnDefinitions(preludeMod)) {
    mod.definitions.set(definition.name, definition)
  }
}
