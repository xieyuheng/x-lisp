import { type Mod } from "../mod/index.ts"
import { formatDefinition } from "./formatDefinition.ts"

export function formatMod(mod: Mod): string {
  const definitions = mod.definitions.values().map(formatDefinition)

  return Array.from(definitions).join(" ")
}
