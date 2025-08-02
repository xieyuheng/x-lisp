import { modOwnDefs, modSet, type Mod } from "../mod/index.ts"
import { usePreludeMod } from "./usePreludeMod.ts"

export function requirePrelude(mod: Mod): void {
  const preludeMod = usePreludeMod()
  for (const def of modOwnDefs(preludeMod)) {
    modSet(mod, def.name, def)
  }
}
