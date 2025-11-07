import { type Mod } from "../mod/index.ts"
import { formatDefinition } from "./formatDefinition.ts"

export function formatMod(mod: Mod): string {
  return Array.from(
    mod.definitions
      .values()
      .filter((definition) => definition.kind === "FunctionDefinition")
      .map(formatDefinition),
  ).join(" ")
}
