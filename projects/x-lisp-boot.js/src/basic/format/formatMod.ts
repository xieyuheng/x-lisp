import { type Mod } from "../mod/index.ts"
import * as Stmts from "../stmt/index.ts"
import { formatDefinition } from "./formatDefinition.ts"
import { formatModuleStmt } from "./formatModuleStmt.ts"

export function formatMod(mod: Mod): string {
  const moduleStmts = mod.stmts
    .filter(Stmts.isAboutModule)
    .map(formatModuleStmt)
  const functionDefinitions = mod.definitions
    .values()
    .filter((definition) => definition.kind === "FunctionDefinition")
    .map(formatDefinition)
  return Array.from([...moduleStmts, ...functionDefinitions]).join(" ")
}
