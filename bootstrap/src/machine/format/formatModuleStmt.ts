import * as S from "@xieyuheng/x-sexp.js"
import type { Stmt } from "../stmt/index.ts"
import * as Stmts from "../stmt/index.ts"

export function formatModuleStmt(stmt: Stmt): string {
  if (!Stmts.isAboutModule(stmt)) {
    let message = `[formatModuleStmt] non module stmt`
    message += `\n  stmt kind: ${stmt.kind}`
    throw new S.ErrorWithMeta(message, stmt.meta)
  }

  switch (stmt.kind) {
    case "Export": {
      return `(export ${stmt.names.join(" ")})`
    }

    case "Extern": {
      return `(extern ${stmt.names.join(" ")})`
    }
  }
}
