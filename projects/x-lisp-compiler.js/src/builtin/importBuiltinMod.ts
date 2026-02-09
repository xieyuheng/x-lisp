import * as L from "../lisp/index.ts"
import { useBuiltinMod } from "./useBuiltinMod.ts"

export function importBuiltinMod(mod: L.Mod): void {
  const builtinMod = useBuiltinMod()
  for (const definition of builtinMod.definitions.values()) {
    L.modDefine(mod, definition.name, definition)
  }
}
