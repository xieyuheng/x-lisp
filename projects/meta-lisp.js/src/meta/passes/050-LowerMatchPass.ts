import * as M from "../index.ts"

export function LowerMatchPass(
  project: M.Project,
  modInfo: M.ModInfo,
  algebraicInfo: M.AlgebraicInfo,
  options: Map<string, string>,
): void {
  for (const [path, fragment] of project.fragments) {
    const scope = modInfo.fragmentScopes.get(path)
    if (!scope) {
      throw new Error(`[LowerMatchPass] missing scope for: ${path}`)
    }
    for (const stmt of fragment.stmts) {
      lowerMatchStmt(scope, fragment.modName, algebraicInfo, stmt)
    }
  }

  if (options.has("dump")) M.projectDumpFragments(project, "050-lower-match")
}

function lowerMatchStmt(
  scope: M.FragmentScope,
  currentModName: string,
  algebraicInfo: M.AlgebraicInfo,
  stmt: M.Stmt<M.Exp>,
): void {
  switch (stmt.kind) {
    case "DefineFunctionStmt":
    case "DefineVariableStmt":
    case "DefineTestStmt":
    case "DefineTypeStmt": {
      stmt.body = lowerMatch(scope, currentModName, algebraicInfo, stmt.body)
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
  exp: M.Exp,
): M.Exp {
  switch (exp.kind) {
    case "MatchExp": {
      const ctx = M.makeDesugarMatchCtx(scope, currentModName, algebraicInfo)
      const defaultExp = M.makeDefaultExp(exp.targets, exp.location)

      return M.desugarMatch(
        ctx,
        exp.targets.map((t) =>
          lowerMatch(scope, currentModName, algebraicInfo, t),
        ),
        exp.clauses.map((clause) => ({
          ...clause,
          body: lowerMatch(scope, currentModName, algebraicInfo, clause.body),
        })),
        defaultExp,
        exp.location,
      )
    }

    default: {
      return M.expTraverse(
        (child) => lowerMatch(scope, currentModName, algebraicInfo, child),
        exp,
      )
    }
  }
}
