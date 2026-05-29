import * as M from "../index.ts"

export function LowerMatchPass(
  rootPkg: M.Package,
  modInfo: M.ModInfo,
  algebraicInfo: M.AlgebraicInfo,
  options: Map<string, string>,
): void {
  for (const pkg of M.packageClosureInTopologicalOrder(rootPkg)) {
    for (const [path, fragment] of pkg.fragments) {
      const scope = modInfo.fragmentScopes.get(path)
      if (!scope) {
        throw new Error(`[LowerMatchPass] missing scope for: ${path}`)
      }
      for (const stmt of fragment.stmts) {
        const fragPkgId = pkg.id
        lowerMatchStmt(scope, fragment.modName, algebraicInfo, fragPkgId, stmt)
      }
    }
  }

  if (options.has("dump")) M.packageDumpFragments(rootPkg, "050-lower-match")
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
      stmt.body = lowerMatch(scope, currentModName, algebraicInfo, pkgId, stmt.body)
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
      const ctx = M.makeDesugarMatchCtx(scope, currentModName, algebraicInfo, pkgId)
      const defaultExp = M.makeDefaultExp(exp.targets, exp.location)

      return M.desugarMatch(
        ctx,
        exp.targets.map((t) =>
          lowerMatch(scope, currentModName, algebraicInfo, pkgId, t),
        ),
        exp.clauses.map((clause) => ({
          ...clause,
          body: lowerMatch(scope, currentModName, algebraicInfo, pkgId, clause.body),
        })),
        defaultExp,
        exp.location,
      )
    }

    default: {
      return M.expTraverse(
        (child) => lowerMatch(scope, currentModName, algebraicInfo, pkgId, child),
        exp,
      )
    }
  }
}
