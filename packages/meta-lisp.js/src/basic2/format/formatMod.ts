import * as B from "../index.ts"
import { formatType } from "./formatType.ts"
import { formatDefinition } from "./formatDefinition.ts"

export function formatMod(mod: B.Mod): string {
  const texts: Array<string> = []

  for (const [name, type] of mod.claims) {
    texts.push(`(claim ${name} ${formatType(type)})`)
  }

  for (const definition of mod.definitions.values()) {
    texts.push(formatDefinition(definition))
  }

  return texts.join("\n") + "\n"
}
