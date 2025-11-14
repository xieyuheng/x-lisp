import { type Mod } from "../mod/index.ts"
import { formatDefinition } from "./formatDefinition.ts"

export function formatMod(mod: Mod): string {
  const exported = `(export ${Array.from(mod.exported).join(" ")})`
  const externed = `(extern ${Array.from(mod.externed).join(" ")})`
  const definitions = mod.definitions.values().map(formatDefinition)
  return Array.from([exported, ...definitions, externed]).join(" ")
}
