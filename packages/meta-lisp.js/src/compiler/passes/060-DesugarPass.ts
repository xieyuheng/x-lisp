import * as S from "@xieyuheng/sexp.js"
import * as M from "../../meta/index.ts"

export function DesugarPass(pkg: M.Package): void {
  for (const fragment of pkg.fragments.values()) {
    fragment.desugaredStmts = fragment.stmts.map(desugarStmt)
  }

  if (pkg.config.compiler.dump)
    M.packageDumpDesugaredFragments(pkg, "060-desugar")
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
        stmt.typeConstructor,
        M.desugar(stmt.representationType),
        stmt.interfaceEntries.map((f) => ({
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
    case "DeclarePrimitiveVariableStmt":
    case "CommentStmt": {
      return stmt
    }

    default: {
      // - why: no need to handle stmts that are removed during ExpandPass.
      let message = `[desugarStmt] unhandled stmt kind: ${stmt.kind}`
      throw new S.ErrorWithSourceLocation(message, stmt.location)
    }
  }
}
