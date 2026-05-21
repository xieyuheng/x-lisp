import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"

export function ModuleImportPass(
  project: M.Project,
  info: M.ModInfo,
  options: { dump: boolean },
): void {
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

  if (options.dump) M.projectDumpFragments(project, "039-module-import")
}

function moduleImportStmt(scope: M.FragmentScope, stmt: M.Stmt): M.Stmt {
  switch (stmt.kind) {
    case "ClaimStmt": {
      return M.ClaimStmt(
        stmt.name,
        moduleImportExp(scope, stmt.type),
        stmt.location,
      )
    }

    case "AdmitStmt": {
      return M.AdmitStmt(
        stmt.name,
        moduleImportExp(scope, stmt.type),
        stmt.location,
      )
    }

    case "DefineFunctionStmt": {
      const boundNames = new Set(stmt.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.DefineFunctionStmt(
        stmt.name,
        stmt.parameters,
        moduleImportExp(newScope, stmt.body),
        stmt.location,
      )
    }

    case "DefineVariableStmt": {
      return M.DefineVariableStmt(
        stmt.name,
        moduleImportExp(scope, stmt.body),
        stmt.location,
      )
    }

    case "DefineTestStmt": {
      return M.DefineTestStmt(
        stmt.name,
        moduleImportExp(scope, stmt.body),
        stmt.location,
      )
    }

    case "DefineTypeStmt": {
      return M.DefineTypeStmt(
        stmt.name,
        stmt.parameters,
        moduleImportExp(scope, stmt.body),
        stmt.location,
      )
    }

    case "DefineAlgebraicTypeStmt": {
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

    case "DefineOpaqueTypeStmt": {
      const boundNames = new Set(stmt.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.DefineOpaqueTypeStmt(
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
    case "VarExp": {
      const entry = scope.importedNames.get(exp.name)
      if (entry) {
        return M.QualifiedVarExp(entry.modName, entry.name, exp.location)
      } else {
        return exp
      }
    }

    case "QualifiedVarExp": {
      const entry = scope.importedPrefixes.get(exp.modName)
      if (entry) {
        return M.QualifiedVarExp(entry.modName, exp.name, exp.location)
      } else {
        return exp
      }
    }

    case "LambdaExp": {
      const boundNames = new Set(exp.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.LambdaExp(
        exp.parameters,
        moduleImportExp(newScope, exp.body),
        exp.location,
      )
    }

    case "PolymorphicExp": {
      const boundNames = new Set(exp.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.PolymorphicExp(
        exp.parameters,
        moduleImportExp(newScope, exp.body),
        exp.location,
      )
    }

    case "Let1Exp": {
      const boundNames = new Set([exp.name])
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.Let1Exp(
        exp.name,
        moduleImportExp(scope, exp.rhs),
        moduleImportExp(newScope, exp.body),
        exp.location,
      )
    }

    case "MatchExp": {
      return M.MatchExp(
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
