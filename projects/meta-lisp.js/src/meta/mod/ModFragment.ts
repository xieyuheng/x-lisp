import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import * as M from "../index.ts"

export type ModFragment = {
  modName: string
  isTypeErrorModule?: boolean
  stmts: Array<M.Stmt>
}

export function loadModFragment(path: string): ModFragment {
  const code = fs.readFileSync(path, "utf-8")
  const sexps = S.parseSexps(code, { path })
  const stmts = sexps.map(M.parseStmt)
  const { modName, isTypeErrorModule } = findModName(stmts)
  return {
    modName,
    isTypeErrorModule,
    stmts,
  }
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

  throw new Error(`[loadModFragment] no module name`)
}
