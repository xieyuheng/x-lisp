import * as M from "../index.ts"
import { loadDefine as executeDefine } from "./executeDefine.ts"
import { loadExempt as executeExempt } from "./executeExempt.ts"
import { loadImport as executeImport } from "./executeImport.ts"

export function loadCode(project: M.Project, path: string): void {
  const fragment = M.loadModFragment(path)
  let mod =
    M.projectLookupMod(project, fragment.modName) ||
    M.createMod(fragment.modName, project)

  M.projectAddMod(project, mod)

  if (fragment.isTypeErrorModule) {
    mod.isTypeErrorModule = true
  }

  const scope = M.createModScope()
  executeStmts(mod, scope, fragment.stmts)
}

function executeStmts(
  mod: M.Mod,
  scope: M.ModScope,
  stmts: Array<M.Stmt>,
): void {
  for (const stmt of stmts) executeExempt(mod, scope, stmt)
  for (const stmt of stmts) executeImport(mod, scope, stmt)
  for (const stmt of stmts) executeDefine(mod, scope, stmt)
}
