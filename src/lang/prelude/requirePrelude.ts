import { modOwnDefs, modSet, type Mod } from "../mod/index.ts"
import { usePreludeMod } from "./usePreludeMod.ts"

export async function requirePrelude(mod: Mod) {
  const preludeMod = await usePreludeMod()
  for (const def of modOwnDefs(preludeMod)) {
    modSet(mod, def.name, def)
  }
}
