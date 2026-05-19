import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"

export function ModuleImportPass(project: M.Project, info: M.ModInfo): void {
  for (const [path, fragment] of project.fragments) {
    const scope = info.fragmentScopes.get(path)
    if (scope) {
      fragment.stmts = fragment.stmts.map((stmt) =>
        moduleImportStmt(scope, stmt),
      )
    } else {
      let message = `[ModuleImportPass] missing scope for: ${path}`
      throw new Error(message)
    }
  }
}

function moduleImportStmt(scope: M.FragmentScope, stmt: M.Stmt): M.Stmt {
  switch (stmt.kind) {
    case "Claim": {
      return M.Claim(
        stmt.name,
        moduleImportExp(scope, stmt.type),
        stmt.location,
      )
    }

    case "Admit": {
      return M.Admit(
        stmt.name,
        moduleImportExp(scope, stmt.type),
        stmt.location,
      )
    }

    case "DefineFunction": {
      const boundNames = new Set(stmt.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.DefineFunction(
        stmt.name,
        stmt.parameters,
        moduleImportExp(newScope, stmt.body),
        stmt.location,
      )
    }

    case "DefineVariable": {
      return M.DefineVariable(
        stmt.name,
        moduleImportExp(scope, stmt.body),
        stmt.location,
      )
    }

    case "DefineTest": {
      return M.DefineTest(
        stmt.name,
        moduleImportExp(scope, stmt.body),
        stmt.location,
      )
    }

    case "DefineType": {
      return M.DefineType(
        stmt.name,
        stmt.parameters,
        moduleImportExp(scope, stmt.body),
        stmt.location,
      )
    }

    case "DefineAlgebraicType": {
      const boundNames = new Set(stmt.typeConstructor.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      for (const ctor of stmt.dataConstructors) {
        ctor.fields = ctor.fields.map((field) => ({
          ...field,
          type: moduleImportExp(newScope, field.type),
        }))
      }

      return stmt
    }

    case "DefineOpaqueType": {
      const boundNames = new Set(stmt.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.DefineOpaqueType(
        stmt.name,
        stmt.parameters,
        moduleImportExp(newScope, stmt.representationType),
        stmt.interfaceFunctions.map((f) => ({
          ...f,
          type: moduleImportExp(newScope, f.type),
        })),
        stmt.location,
      )
    }

    default: {
      return stmt
    }
  }
}

function moduleImportExp(scope: M.FragmentScope, exp: M.Exp): M.Exp {
  switch (exp.kind) {
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

    case "Lambda": {
      const boundNames = new Set(exp.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.Lambda(
        exp.parameters,
        moduleImportExp(newScope, exp.body),
        exp.location,
      )
    }

    case "Polymorphic": {
      const boundNames = new Set(exp.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.Polymorphic(
        exp.parameters,
        moduleImportExp(newScope, exp.body),
        exp.location,
      )
    }

    case "Let1": {
      const boundNames = new Set([exp.name])
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.Let1(
        exp.name,
        moduleImportExp(scope, exp.rhs),
        moduleImportExp(newScope, exp.body),
        exp.location,
      )
    }

    case "Match": {
      return M.Match(
        exp.targets.map((target) => moduleImportExp(scope, target)),
        exp.clauses.map((clause) => {
          const boundNames = setUnionMany(
            clause.patterns.map(M.patternBoundNames),
          )
          const newScope = scopeFilterBoundNames(scope, boundNames)
          return M.MatchClause(
            clause.patterns.map((pattern) =>
              moduleImportExp(newScope, pattern),
            ),
            moduleImportExp(newScope, clause.body),
            clause.location,
          )
        }),
        exp.location,
      )
    }

    default: {
      return M.expTraverse((child) => moduleImportExp(scope, child), exp)
    }
  }
}

function scopeFilterBoundNames(
  scope: M.FragmentScope,
  boundNames: Set<string>,
): M.FragmentScope {
  const importedNames: Map<string, { modName: string; name: string }> =
    new Map()
  for (const [key, entry] of scope.importedNames) {
    if (!boundNames.has(key)) {
      importedNames.set(key, entry)
    }
  }

  return {
    importedNames,
    importedPrefixes: scope.importedPrefixes,
  }
}
