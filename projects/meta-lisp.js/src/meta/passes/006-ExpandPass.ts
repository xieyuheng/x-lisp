import * as M from "../index.ts"

export function ExpandPass(project: M.Project): void {
  for (const fragment of project.fragments.values()) {
    fragment.stmts = fragment.stmts.flatMap(expandStmt)
  }
}

function expandStmt(stmt: M.Stmt): Array<M.Stmt> {
  switch (stmt.kind) {
    // case "DefineData": {
    // }

    default: {
      return [stmt]
    }
  }
}
