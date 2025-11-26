import { type Mod, modOwnDefinitions } from "../mod/index.ts"
import * as Stmts from "../stmt/index.ts"
import { formatDefinition } from "./formatDefinition.ts"
import { formatModuleStmt } from "./formatModuleStmt.ts"

export function formatMod(mod: Mod): string {
  const moduleStmts = mod.stmts
    .filter(Stmts.isAboutModule)
    .map(formatModuleStmt)

  const definitions = modOwnDefinitions(mod).values().map(formatDefinition)

  return Array.from([...moduleStmts, ...definitions]).join(" ")
}
