import * as M from "../index.ts"
import { loadDefine as executeDefine } from "./executeDefine.ts"
import { loadExempt as executeExempt } from "./executeExempt.ts"
import { loadImport as executeImport } from "./executeImport.ts"

export function executeStmts(
  mod: M.Mod,
  stmts: Array<M.Stmt>,
): void {
  const scope = M.createModScope()

  for (const stmt of stmts) executeExempt(mod, scope, stmt)
  for (const stmt of stmts) executeImport(mod, scope, stmt)
  for (const stmt of stmts) executeDefine(mod, scope, stmt)
}
