import * as M from "../index.ts"

export function formatModStmts(mod: M.Mod): string {
  return mod.stmts.map((stmt) => M.formatStmt(stmt, M.formatExp)).join(" ")
}

export function formatFragmentStmts(stmts: Array<M.Stmt<M.Exp>>): string {
  return stmts.map((stmt) => M.formatStmt(stmt, M.formatExp)).join("\n\n")
}

export function formatModDefinitions(mod: M.Mod): string {
  const definitions = mod.definitions.values().map(M.formatDefinition)
  return Array.from(definitions).join(" ")
}
