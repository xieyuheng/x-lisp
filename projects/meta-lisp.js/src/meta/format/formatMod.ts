import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"
import { formatDefinition } from "./formatDefinition.ts"
import { formatStmt } from "./formatStmt.ts"

export function formatModStmts(mod: Mod): string {
  return mod.stmts.map(formatStmt).join(" ")
}

export function formatModDefinitions(mod: Mod): string {
  const definitions = M.modOwnDefinitions(mod).map(formatDefinition)

  return Array.from(definitions).join(" ")
}
