import {
  callWithFile,
  fileRead,
  openInputFile,
} from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { loadDefine } from "./loadDefine.ts"
import { loadExempt } from "./loadExempt.ts"
import { loadImport } from "./loadImport.ts"

export function loadCode(project: M.Project, path: string): M.Mod {
  const stmts = loadStmts(path)
  const modName = findModName(stmts)
  let mod = M.projectLookupMod(project, modName)
  if (mod === undefined) {
    mod = M.createMod(modName, project)
    M.projectAddMod(project, mod)
    const builtinMod = M.loadBuiltinMod(project)
    for (const definition of builtinMod.definitions.values()) {
      M.modDefine(mod, definition.name, definition)
    }
  }

  const scope = M.createModScope()

  for (const stmt of stmts) loadExempt(mod, scope, stmt)
  for (const stmt of stmts) loadImport(mod, scope, stmt)
  for (const stmt of stmts) loadDefine(mod, scope, stmt)

  return mod
}

function findModName(stmts: Array<M.Stmt>): string {
  return `TODO`
}

export function loadStmts(path: string): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  callWithFile(openInputFile(path), (file) => {
    const code = fileRead(file)
    const sexps = S.parseSexps(code, { path })
    stmts.push(...sexps.map(M.parseStmt))
  })

  return stmts
}
