import * as S from "@xieyuheng/sexp.js"
import type { Exp, Stmt } from "../index.ts"

export type ModuleDeclaration = {
  name: string
  location: S.SourceLocation
}

export function findModuleDeclarations(
  stmts: Array<Stmt<Exp>>,
): Array<ModuleDeclaration> {
  const result: Array<ModuleDeclaration> = []

  for (const stmt of stmts) {
    if (stmt.kind === "DeclareModuleStmt") {
      result.push({ name: stmt.name, location: stmt.location })
    }
  }

  return result
}
