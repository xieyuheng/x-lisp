import * as M from "../index.ts"

export type Fragment = {
  id: string
  path: string
  blockIndex?: number
  modName: string
  stmts: Array<M.Stmt<M.Exp>>
  desugaredStmts: Array<M.Stmt<M.Term>>
}

export function fragmentNames(fragment: Fragment): Set<string> {
  const names = new Set<string>()
  for (const stmt of fragment.stmts) {
    collectNameFromStmt(names, stmt)
  }

  return names
}

function collectNameFromStmt(names: Set<string>, stmt: M.Stmt<M.Exp>): void {
  switch (stmt.kind) {
    case "DefineFunctionStmt":
    case "DefineVariableStmt":
    case "DefineTestStmt":
    case "DefineTypeStmt":
    case "ClaimStmt":
    case "ClaimTypeStmt":
    case "DeclarePrimitiveFunctionStmt":
    case "DeclarePrimitiveVariableStmt": {
      names.add(stmt.name)
      return
    }

    case "DefineEnumStmt":
    case "DefineAlgebraicTypeStmt":
    case "DefineStructTypeStmt":
    case "DefineOpaqueTypeStmt": {
      names.add(stmt.typeConstructor.name)
      return
    }
  }
}
