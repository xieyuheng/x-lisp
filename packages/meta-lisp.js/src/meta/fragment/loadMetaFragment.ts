import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import * as M from "../index.ts"

export function loadMetaFragment(path: string): M.Fragment {
  const code = fs.readFileSync(path, "utf-8")
  const sexps = S.parseSexps(code, { path })
  const stmts = sexps.map(M.parseStmt)
  const modName = findModName(path, stmts)

  return {
    id: path,
    path,
    modName,
    stmts,
    desugaredStmts: [],
  }
}

function findModName(path: string, stmts: Array<M.Stmt<M.Exp>>): string {
  for (const stmt of stmts) {
    if (stmt.kind === "DeclareModuleStmt") {
      return stmt.name
    }
  }

  let message = `[loadMetaFragment] expect (module) statement in module fragment`
  message += `\n  path: ${path}`
  throw new Error(message)
}
