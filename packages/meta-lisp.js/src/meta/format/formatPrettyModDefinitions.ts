import * as Ppml from "@xieyuheng/ppml.js"
import * as M from "../index.ts"

export function formatPrettyModDefinitions(width: number, mod: M.Mod): string {
  return M.prettyModDefinitions(mod)
    .map((node) => Ppml.formatNode(node, { width }))
    .join("\n\n")
}
