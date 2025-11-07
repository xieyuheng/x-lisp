import { modPublicDefinitions, type Mod } from "../mod/index.ts"
import { usePreludeMod } from "./usePreludeMod.ts"

export function importPrelude(mod: Mod) {
  const preludeMod = usePreludeMod()
  for (const [name, definition] of modPublicDefinitions(preludeMod).entries()) {
    mod.definitions.set(name, definition)
  }
}
