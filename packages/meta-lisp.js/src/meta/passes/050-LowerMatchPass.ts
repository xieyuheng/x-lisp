import * as M from "../index.ts"

export function LowerMatchPass(
  pkg: M.Package,
  analysisReport: M.ModuleAnalysisReport,
  algebraicReport: M.AlgebraicAnalysisReport,
): void {
  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const [path, fragment] of orderedPkg.fragments) {
      const scope = analysisReport.fragmentScopes.get(path)
      if (!scope) {
        throw new Error(`[LowerMatchPass] missing scope for: ${path}`)
      }
      for (const stmt of fragment.stmts) {
        const fragPkgId = orderedPkg.id
        lowerMatchStmt(scope, fragment.modName, algebraicReport, fragPkgId, stmt)
      }
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpFragments(pkg, "050-lower-match")
}

function lowerMatchStmt(
  scope: M.FragmentScope,
  currentModName: string,
  algebraicReport: M.AlgebraicAnalysisReport,
  pkgId: string,
  stmt: M.Stmt<M.Exp>,
): void {
  switch (stmt.kind) {
    case "DefineFunctionStmt":
    case "DefineVariableStmt":
    case "DefineTestStmt":
    case "DefineTypeStmt": {
      stmt.body = lowerMatch(
        scope,
        currentModName,
        algebraicReport,
        pkgId,
        stmt.body,
      )
      return
    }

    default: {
      return
    }
  }
}

function lowerMatch(
  scope: M.FragmentScope,
  currentModName: string,
  algebraicReport: M.AlgebraicAnalysisReport,
  pkgId: string,
  exp: M.Exp,
): M.Exp {
  switch (exp.kind) {
    case "MatchExp": {
      const ctx = M.makeDesugarMatchCtx(
        scope,
        currentModName,
        algebraicReport,
        pkgId,
      )
      const defaultExp = M.makeDefaultExp(exp.targets, exp.location)

      return M.desugarMatch(
        ctx,
        exp.targets.map((t) =>
          lowerMatch(scope, currentModName, algebraicReport, pkgId, t),
        ),
        exp.clauses.map((clause) => ({
          ...clause,
          body: lowerMatch(
            scope,
            currentModName,
            algebraicReport,
            pkgId,
            clause.body,
          ),
        })),
        defaultExp,
        exp.location,
      )
    }

    default: {
      return M.expTraverse(
        (child) =>
          lowerMatch(scope, currentModName, algebraicReport, pkgId, child),
        exp,
      )
    }
  }
}
