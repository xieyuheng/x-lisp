import * as M from "../index.ts"

export function formatModStmts(mod: M.Mod): string {
  return mod.stmts.map(M.formatStmt).join(" ")
}

export function formatModDefinitions(mod: M.Mod): string {
  const definitions = mod.definitions.values().map(M.formatDefinition)
  return Array.from(definitions).join(" ")
}
