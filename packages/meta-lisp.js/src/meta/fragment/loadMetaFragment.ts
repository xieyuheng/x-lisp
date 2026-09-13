import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import * as M from "../index.ts"
import { findModuleDeclarations } from "./findModuleDeclarations.ts"

export function loadMetaFragment(path: string): M.Fragment {
  const code = fs.readFileSync(path, "utf-8")
  const sexps = S.parseSexps(code, { path })
  const stmts = sexps.map(M.parseStmt)
  const modName = resolveMetaModName(path, stmts)

  return {
    id: path,
    path,
    modName,
    stmts,
    desugaredStmts: [],
  }
}

function resolveMetaModName(path: string, stmts: Array<M.Stmt<M.Exp>>): string {
  const moduleDeclarations = findModuleDeclarations(stmts)

  if (moduleDeclarations.length === 0) {
    let message = `[loadMetaFragment] expect (module) statement in module fragment`
    message += `\n  path: ${path}`
    throw new Error(message)
  }

  if (moduleDeclarations.length > 1) {
    let message = `[loadMetaFragment] multiple module declarations in module fragment`
    message += `\n  path: ${path}`
    message += `\n  modules: ${moduleDeclarations
      .map((declaration) => declaration.name)
      .join(", ")}`
    throw new Error(message)
  }

  return moduleDeclarations[0].name
}
