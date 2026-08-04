import * as M from "../../meta/index.ts"
import * as Passes from "./index.ts"

export function LowerMatchPass(
  pkg: M.Package,
  moduleReport: Passes.ModuleAnalysisReport,
  algebraicReport: Passes.AlgebraicAnalysisReport,
): void {
  for (const [path, fragment] of pkg.fragments) {
    const scope = moduleReport.fragmentScopes.get(path)
    if (!scope) {
      throw new Error(`[LowerMatchPass] missing scope for: ${path}`)
    }
    const ctx = M.makeDesugarMatchCtx(
      scope,
      fragment.modName,
      algebraicReport,
      pkg.id,
    )
    for (const stmt of fragment.stmts) {
      lowerMatchStmt(ctx, stmt)
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
      return M.desugarMatch(
        ctx,
        exp.targets.map((t) => lowerMatch(ctx, t)),
        exp.clauses.map((clause) => ({
          ...clause,
          body: lowerMatch(ctx, clause.body),
        })),
        M.makeDefaultExp(exp.targets, exp.location),
        exp.location,
      )
    }

    default: {
      return M.expTraverse((child) => lowerMatch(ctx, child), exp)
    }
  }
}
