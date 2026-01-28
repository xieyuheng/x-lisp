import { type Mod } from "../mod/index.ts"
import { formatStmt } from "./formatStmt.ts"

export function formatMod(mod: Mod): string {
  return mod.stmts.map(formatStmt).join(" ")
}
