import * as M from "../index.ts"

export function LowerMatchPass(
  pkg: M.Package,
  moduleAnalysisReport: M.ModuleAnalysisReport,
  algebraicAnalysisReport: M.AlgebraicAnalysisReport,
): void {
  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const [path, fragment] of orderedPkg.fragments) {
      const scope = moduleAnalysisReport.fragmentScopes.get(path)
      if (!scope) {
        throw new Error(`[LowerMatchPass] missing scope for: ${path}`)
      }
      const ctx = M.makeDesugarMatchCtx(
        scope,
        fragment.modName,
        algebraicAnalysisReport,
        orderedPkg.id,
      )
      for (const stmt of fragment.stmts) {
        lowerMatchStmt(ctx, stmt)
      }
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpFragments(pkg, "050-lower-match")
}

function lowerMatchStmt(ctx: M.DesugarMatchCtx, stmt: M.Stmt<M.Exp>): void {
  switch (stmt.kind) {
    case "DefineFunctionStmt":
    case "DefineVariableStmt":
    case "DefineTestStmt":
    case "DefineTypeStmt": {
      stmt.body = lowerMatch(ctx, stmt.body)
      return
    }

    default: {
      return
    }
  }
}

function lowerMatch(ctx: M.DesugarMatchCtx, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "MatchExp": {
      const defaultExp = M.makeDefaultExp(exp.targets, exp.location)

      return M.desugarMatch(
        ctx,
        exp.targets.map((t) => lowerMatch(ctx, t)),
        exp.clauses.map((clause) => ({
          ...clause,
          body: lowerMatch(ctx, clause.body),
        })),
        defaultExp,
        exp.location,
      )
    }

    default: {
      return M.expTraverse((child) => lowerMatch(ctx, child), exp)
    }
  }
}
