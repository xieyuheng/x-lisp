import { modOwnDefs, type Mod } from "../mod/index.ts"
import { usePreludeMod } from "./usePreludeMod.ts"

export function requirePrelude(mod: Mod) {
  const preludeMod = usePreludeMod()
  for (const def of modOwnDefs(preludeMod)) {
    mod.defs.set(def.name, def)
  }
}
