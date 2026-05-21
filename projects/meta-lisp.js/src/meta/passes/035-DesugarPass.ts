import * as M from "../index.ts"

export function DesugarPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const fragment of project.fragments.values()) {
    fragment.desugaredStmts = fragment.stmts.map(desugarStmt)
  }

  if (options.dump) M.projectDumpFragments(project, "035-desugar")
}

function desugarStmt(stmt: M.Stmt<M.Exp>): M.Stmt<M.Term> {
  switch (stmt.kind) {
    case "DefineFunctionStmt": {
      return M.DefineFunctionStmt(
        stmt.name,
        stmt.parameters,
        M.desugar(stmt.body),
        stmt.location,
      )
    }

    case "DefineVariableStmt": {
      return M.DefineVariableStmt(
        stmt.name,
        M.desugar(stmt.body),
        stmt.location,
      )
    }

    case "DefineTestStmt": {
      return M.DefineTestStmt(stmt.name, M.desugar(stmt.body), stmt.location)
    }

    case "DefineTypeStmt": {
      return M.DefineTypeStmt(
        stmt.name,
        stmt.parameters,
        M.desugar(stmt.body),
        stmt.location,
      )
    }

    case "ClaimStmt": {
      return M.ClaimStmt(stmt.name, M.desugar(stmt.type), stmt.location)
    }

    case "AdmitStmt": {
      return M.AdmitStmt(stmt.name, M.desugar(stmt.type), stmt.location)
    }

    case "DefineAlgebraicTypeStmt": {
      return M.DefineAlgebraicTypeStmt(
        stmt.typeConstructor,
        stmt.dataConstructors.map((ctor) => ({
          ...ctor,
          fields: ctor.fields.map((field) => ({
            ...field,
            type: M.desugar(field.type),
          })),
        })),
        stmt.location,
      )
    }

    case "DefineOpaqueTypeStmt": {
      return M.DefineOpaqueTypeStmt(
        stmt.name,
        stmt.parameters,
        M.desugar(stmt.representationType),
        stmt.interfaceFunctions.map((f) => ({
          ...f,
          type: M.desugar(f.type),
        })),
        stmt.location,
      )
    }

    // Stmts with no Exp/Term type parameter — pass through
    case "ImportStmt":
    case "ImportAsStmt":
    case "ImportAllStmt":
    case "ClaimTypeStmt":
    case "ExemptStmt":
    case "PrivateStmt":
    case "DeclareModuleStmt":
    case "DeclarePrimitiveFunctionStmt":
    case "DeclarePrimitiveVariableStmt": {
      return stmt
    }

    default: {
      let message = `[desugarStmt] unhandled stmt kind: ${stmt.kind}`
      throw new Error(message)
    }
  }
}
