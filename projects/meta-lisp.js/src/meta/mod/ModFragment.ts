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

export function modFragmentNames(fragment: ModFragment): Set<string> {
  const names = new Set<string>()
  for (const stmt of fragment.stmts) {
    collectNameFromStmt(names, stmt)
  }

  return names
}

function collectNameFromStmt(names: Set<string>, stmt: M.Stmt): void {
  switch (stmt.kind) {
    case "DefineFunction":
    case "DefineVariable":
    case "DefineTest":
    case "DefineType":
    case "Claim":
    case "DeclarePrimitiveFunction":
    case "DeclarePrimitiveVariable": {
      names.add(stmt.name)
      return
    }

    case "DefineInterface": {
      names.add(stmt.interfaceConstructor.name)
      return
    }

    case "DefineData": {
      names.add(stmt.dataTypeConstructor.name)
      return
    }
  }
}
