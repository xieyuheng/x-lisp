import * as M from "../index.ts"

export function DesugarPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const fragment of project.fragments.values()) {
    fragment.stmts = fragment.stmts.map(desugarStmt)
  }

  if (options.dump) M.projectDumpFragments(project, "035-desugar")
}

function desugarStmt(stmt: M.Stmt): M.Stmt {
  switch (stmt.kind) {
    case "DefineFunctionStmt": {
      return {
        ...stmt,
        body: M.desugar(M.createDesugarState(), stmt.body),
      }
    }

    case "DefineVariableStmt": {
      return {
        ...stmt,
        body: M.desugar(M.createDesugarState(), stmt.body),
      }
    }

    case "DefineTestStmt": {
      return {
        ...stmt,
        body: M.desugar(M.createDesugarState(), stmt.body),
      }
    }

    case "DefineTypeStmt": {
      return {
        ...stmt,
        body: M.desugar(M.createDesugarState(), stmt.body),
      }
    }

    case "ClaimStmt": {
      return {
        ...stmt,
        type: M.desugar(M.createDesugarState(), stmt.type),
      }
    }

    case "AdmitStmt": {
      return {
        ...stmt,
        type: M.desugar(M.createDesugarState(), stmt.type),
      }
    }

    case "DefineAlgebraicTypeStmt": {
      return {
        ...stmt,
        dataConstructors: stmt.dataConstructors.map((ctor) => ({
          ...ctor,
          fields: ctor.fields.map((field) => ({
            ...field,
            type: M.desugar(M.createDesugarState(), field.type),
          })),
        })),
      }
    }

    default: {
      return stmt
    }
  }
}
