import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import * as M from "../index.ts"

export function loadModFragment(path: string): M.ModFragment {
  const code = fs.readFileSync(path, "utf-8")
  const sexps = S.parseSexps(code, { path })
  const stmts = sexps.map(M.parseStmt)
  const { modName, isTypeErrorModule } = findModName(path, stmts)

  return {
    modName,
    isTypeErrorModule,
    stmts,
  }
}

function findModName(
  path: string,
  stmts: Array<M.Stmt>,
): {
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

  let message = `[loadModFragment] expect (module) statement in module fragment`
  message += `\n  path: ${path}`
  throw new Error(message)
}
