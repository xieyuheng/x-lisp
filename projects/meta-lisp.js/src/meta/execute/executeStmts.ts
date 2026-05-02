import * as M from "../index.ts"
import { executeDefine } from "./executeDefine.ts"
import { executeExempt } from "./executeExempt.ts"
import { executeImport } from "./executeImport.ts"

export function executeStmts(mod: M.Mod, stmts: Array<M.Stmt>): void {
  const scope = M.createExecutionScope()

  for (const stmt of stmts) executeExempt(mod, scope, stmt)
  for (const stmt of stmts) executeImport(mod, scope, stmt)
  for (const stmt of stmts) executeDefine(mod, scope, stmt)
}
