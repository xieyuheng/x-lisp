import * as Ppml from "@xieyuheng/ppml.js"
import { type Mod } from "../mod/Mod.ts"
import { prettyModDefinitions } from "../pretty/prettyMod.ts"

export function formatPrettyModDefinitions(width: number, mod: Mod): string {
  return prettyModDefinitions(mod)
    .map((node) => Ppml.formatNode(node, { width }))
    .join("\n\n")
}
