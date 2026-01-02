import * as S from "@xieyuheng/sexp.js"
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

    case "Import": {
      return `(import "${stmt.path}" ${stmt.names.join(" ")})`
    }

    case "ImportAll": {
      return `(import-all "${stmt.path}")`
    }

    case "ImportExcept": {
      return `(import-except "${stmt.path}" ${stmt.names.join(" ")})`
    }

    case "ImportAs": {
      return `(import-as "${stmt.path}" ${stmt.prefix})`
    }

    case "Include": {
      return `(include "${stmt.path}" ${stmt.names.join(" ")})`
    }

    case "IncludeAll": {
      return `(include-all "${stmt.path}")`
    }

    case "IncludeExcept": {
      return `(include-except "${stmt.path}" ${stmt.names.join(" ")})`
    }

    case "IncludeAs": {
      return `(include-as "${stmt.path}" ${stmt.prefix})`
    }
  }
}
