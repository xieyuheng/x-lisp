import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import * as M from "../index.ts"
import { loadDefine } from "./loadDefine.ts"
import { loadExempt } from "./loadExempt.ts"
import { loadImport } from "./loadImport.ts"

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

  loadStmts(mod, stmts)
}

export function loadStmts(mod: M.Mod, stmts: Array<M.Stmt>): void {
  const fragment = M.createModFragment()

  for (const stmt of stmts) loadExempt(mod, fragment, stmt)
  for (const stmt of stmts) loadImport(mod, fragment, stmt)
  for (const stmt of stmts) loadDefine(mod, fragment, stmt)
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
