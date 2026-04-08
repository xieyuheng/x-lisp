import {
  callWithFile,
  fileRead,
  openInputFile,
} from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { prepareDefine } from "./prepareDefine.ts"
import { prepareExempt } from "./prepareExempt.ts"
import { prepareImport } from "./prepareImport.ts"

export type ModScope = {
  importedNames: Map<string, { modName: string; name: string }>
  importedPrefixes: Map<string, { modName: string }>
}

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

  const scope: ModScope = {
    importedNames: new Map(),
    importedPrefixes: new Map(),
  }

  for (const stmt of stmts) prepareExempt(mod, scope, stmt)
  for (const stmt of stmts) prepareImport(mod, scope, stmt)
  for (const stmt of stmts) prepareDefine(mod, scope, stmt)

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
