import * as M from "../index.ts"

export function qualifyImported(scope: M.ModScope, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    case "Quote": {
      return exp
    }

    case "Var": {
      const entry = scope.importedNames.get(exp.name)
      if (entry) {
        return M.QualifiedVar(entry.modName, entry.name, exp.location)
      } else {
        return exp
      }
    }

    case "QualifiedVar": {
      const entry = scope.importedPrefixes.get(exp.modName)
      if (entry) {
        return M.QualifiedVar(entry.modName, exp.name, exp.location)
      } else {
        return exp
      }
    }

    // no need to avoid free variable in lhs

    case "Lambda": {
      const newScope = M.modScopeFilterBoundNames(
        scope,
        new Set(exp.parameters),
      )
      return M.Lambda(
        exp.parameters,
        qualifyImported(newScope, exp.body),
        exp.location,
      )
    }

    case "Polymorphic": {
      const newScope = M.modScopeFilterBoundNames(
        scope,
        new Set(exp.parameters),
      )
      return M.Polymorphic(
        exp.parameters,
        qualifyImported(newScope, exp.body),
        exp.location,
      )
    }

    case "Let1": {
      const newScope = M.modScopeFilterBoundNames(scope, new Set([exp.name]))
      return M.Let1(
        exp.name,
        qualifyImported(scope, exp.rhs),
        qualifyImported(newScope, exp.body),
        exp.location,
      )
    }

    case "Match": {
      const targets = exp.targets.map((target) =>
        qualifyImported(scope, target),
      )
      const clauses = exp.clauses.map((clause) =>
        M.MatchClause(
          clause.patterns,
          qualifyImported(M.modScopeDropImportedNames(scope), clause.body),
          clause.location,
        ),
      )

      let result: M.Exp = M.Match(targets, clauses, exp.location)
      for (const [name, entry] of scope.importedNames) {
        const rhs = M.QualifiedVar(entry.modName, entry.name, exp.location)
        result = M.Let1(name, rhs, result, exp.location)
      }

      return result
    }

    default: {
      return M.expTraverse((child) => qualifyImported(scope, child), exp)
    }
  }
}
