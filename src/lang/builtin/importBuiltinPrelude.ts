import { modPublicDefinitions, type Mod } from "../mod/index.ts"
import { useBuiltinPreludeMod } from "./useBuiltinPreludeMod.ts"

export function importBuiltinPrelude(mod: Mod) {
  const preludeMod = useBuiltinPreludeMod()
  for (const [name, definition] of modPublicDefinitions(preludeMod).entries()) {
    mod.defined.set(name, definition)
  }
}
