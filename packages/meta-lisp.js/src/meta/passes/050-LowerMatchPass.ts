import * as M from "../index.ts"

export function LowerMatchPass(
  pkg: M.Package,
  analysisResult: M.ModuleAnalysisResult,
  algebraicInfo: M.AlgebraicInfo,
): void {
  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
      for (const [path, fragment] of orderedPkg.fragments) {
      const scope = analysisResult.fragmentScopes.get(path)
      if (!scope) {
        throw new Error(`[LowerMatchPass] missing scope for: ${path}`)
      }
      for (const stmt of fragment.stmts) {
        const fragPkgId = orderedPkg.id
        lowerMatchStmt(scope, fragment.modName, algebraicInfo, fragPkgId, stmt)
      }
    }
  }

  if (pkg.config.compiler.dump)
    M.packageDumpFragments(pkg, "050-lower-match")
}

function lowerMatchStmt(
  scope: M.FragmentScope,
  currentModName: string,
  algebraicInfo: M.AlgebraicInfo,
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
        algebraicInfo,
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
  algebraicInfo: M.AlgebraicInfo,
  pkgId: string,
  exp: M.Exp,
): M.Exp {
  switch (exp.kind) {
    case "MatchExp": {
      const ctx = M.makeDesugarMatchCtx(
        scope,
        currentModName,
        algebraicInfo,
        pkgId,
      )
      const defaultExp = M.makeDefaultExp(exp.targets, exp.location)

      return M.desugarMatch(
        ctx,
        exp.targets.map((t) =>
          lowerMatch(scope, currentModName, algebraicInfo, pkgId, t),
        ),
        exp.clauses.map((clause) => ({
          ...clause,
          body: lowerMatch(
            scope,
            currentModName,
            algebraicInfo,
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
          lowerMatch(scope, currentModName, algebraicInfo, pkgId, child),
        exp,
      )
    }
  }
}
