import * as Ppml from "@xieyuheng/ppml.js"
import type { Stmt } from "../stmt/index.ts"
import * as Stmts from "../stmt/index.ts"

export function prettyStmt(maxWidth: number, stmt: Stmt): string {
  return Ppml.format(maxWidth, renderStmt(stmt))
}

function renderStmt(stmt: Stmt): Ppml.Node {
  if (Stmts.isAboutModule(stmt)) {
    return renderStmtAboutModule(stmt)
  }

  switch (stmt.kind) {
    case "DefineFunction": {
      return Ppml.nil()
    }

    case "DefineVariable": {
      return Ppml.nil()
    }
  }
}

function renderStmtAboutModule(stmt: Stmts.AboutModule): Ppml.Node {
  switch (stmt.kind) {
    case "Export": {
      return Ppml.nil()
    }

    case "Import": {
      return Ppml.nil()
    }

    case "ImportAll": {
      return Ppml.nil()
    }

    case "ImportExcept": {
      return Ppml.nil()
    }

    case "ImportAs": {
      return Ppml.nil()
    }

    case "Include": {
      return Ppml.nil()
    }

    case "IncludeAll": {
      return Ppml.nil()
    }

    case "IncludeExcept": {
      return Ppml.nil()
    }

    case "IncludeAs": {
      return Ppml.nil()
    }
  }
}
