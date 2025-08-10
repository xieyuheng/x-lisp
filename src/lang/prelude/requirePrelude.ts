import { modPublicDefinitions, type Mod } from "../mod/index.ts"
import { usePreludeMod } from "./usePreludeMod.ts"

export function requirePrelude(mod: Mod) {
  const preludeMod = usePreludeMod()
  for (const definition of modPublicDefinitions(preludeMod)) {
    mod.defined.set(definition.name, definition)
  }
}
