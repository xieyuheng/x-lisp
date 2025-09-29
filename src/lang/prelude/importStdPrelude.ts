import { modPublicDefinitions, type Mod } from "../mod/index.ts"
import { useStdPreludeMod } from "./useStdPreludeMod.ts"

export function importStdPrelude(mod: Mod) {
  const preludeMod = useStdPreludeMod()
  for (const [name, definition] of modPublicDefinitions(preludeMod).entries()) {
    mod.defined.set(name, definition)
  }
}
