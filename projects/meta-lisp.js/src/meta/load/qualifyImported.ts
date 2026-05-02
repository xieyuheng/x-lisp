import * as M from "../index.ts"

export function qualifyImported(fragment: M.ModFragment, exp: M.Exp): M.Exp {
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
      const entry = fragment.importedNames.get(exp.name)
      if (entry) {
        return M.QualifiedVar(entry.modName, entry.name, exp.location)
      } else {
        return exp
      }
    }

    case "QualifiedVar": {
      const entry = fragment.importedPrefixes.get(exp.modName)
      if (entry) {
        return M.QualifiedVar(entry.modName, exp.name, exp.location)
      } else {
        return exp
      }
    }

    // no need to avoid free variable in lhs

    case "Lambda": {
      const newScope = M.modFragmentFilterBoundNames(
        fragment,
        new Set(exp.parameters),
      )
      return M.Lambda(
        exp.parameters,
        qualifyImported(newScope, exp.body),
        exp.location,
      )
    }

    case "Polymorphic": {
      const newScope = M.modFragmentFilterBoundNames(
        fragment,
        new Set(exp.parameters),
      )
      return M.Polymorphic(
        exp.parameters,
        qualifyImported(newScope, exp.body),
        exp.location,
      )
    }

    case "Let1": {
      const newScope = M.modFragmentFilterBoundNames(
        fragment,
        new Set([exp.name]),
      )
      return M.Let1(
        exp.name,
        qualifyImported(fragment, exp.rhs),
        qualifyImported(newScope, exp.body),
        exp.location,
      )
    }

    case "Match": {
      const targets = exp.targets.map((target) =>
        qualifyImported(fragment, target),
      )
      const clauses = exp.clauses.map((clause) =>
        M.MatchClause(
          clause.patterns,
          qualifyImported(
            M.modFragmentDropImportedNames(fragment),
            clause.body,
          ),
          clause.location,
        ),
      )

      let result: M.Exp = M.Match(targets, clauses, exp.location)
      for (const [name, entry] of fragment.importedNames) {
        const rhs = M.QualifiedVar(entry.modName, entry.name, exp.location)
        result = M.Let1(name, rhs, result, exp.location)
      }

      return result
    }

    default: {
      return M.expTraverse((child) => qualifyImported(fragment, child), exp)
    }
  }
}
