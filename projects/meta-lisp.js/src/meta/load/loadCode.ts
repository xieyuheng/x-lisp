import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import * as M from "../index.ts"
import { loadDefine as executeDefine } from "./executeDefine.ts"
import { loadExempt as executeExempt } from "./executeExempt.ts"
import { loadImport as executeImport } from "./executeImport.ts"

export function loadCode(project: M.Project, path: string): void {
  const code = fs.readFileSync(path, "utf-8")
  const sexps = S.parseSexps(code, { path })
  const stmts = sexps.map(M.parseStmt)
  const { modName, isTypeErrorModule } = findModName(stmts)
  let mod =
    M.projectLookupMod(project, modName) || M.createMod(modName, project)
  M.projectAddMod(project, mod)

  if (isTypeErrorModule) {
    mod.isTypeErrorModule = isTypeErrorModule
  }

  const scope = M.createModScope()
  executeStmts(mod, scope, stmts)
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

function findModName(stmts: Array<M.Stmt>): {
  modName: string
  isTypeErrorModule?: boolean
} {
  for (const stmt of stmts) {
    if (stmt.kind === "DeclareModule") {
      return { modName: stmt.name }
    }

    if (stmt.kind === "DeclareTypeErrorModule") {
      return { modName: stmt.name, isTypeErrorModule: true }
    }
  }

  throw new Error(`[findModName] no module name`)
}
