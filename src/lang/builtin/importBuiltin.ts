import { modPublicDefinitions, type Mod } from "../mod/index.ts"
import { useBuiltinMod } from "./useBuiltinMod.ts"

export function importBuiltin(mod: Mod) {
  const builtinMod = useBuiltinMod()
  for (const [name, definition] of modPublicDefinitions(builtinMod).entries()) {
    mod.defined.set(name, definition)
  }
}
