import * as M from "../index.ts"

export type ModFragment = {
  modName: string
  isTypeErrorModule?: boolean
  stmts: Array<M.Stmt>
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
