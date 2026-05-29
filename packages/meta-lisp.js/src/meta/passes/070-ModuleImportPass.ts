import * as M from "../index.ts"

export function ModuleImportPass(
  rootPkg: M.Package,
  info: M.ModInfo,
  options: Map<string, string>,
): void {
  for (const pkg of M.packageClosureInTopologicalOrder(rootPkg)) {
    for (const [path, fragment] of pkg.fragments) {
      const scope = info.fragmentScopes.get(path)
      if (scope) {
        fragment.desugaredStmts = fragment.desugaredStmts.map((stmt) =>
          moduleImportStmt(scope, stmt),
        )
      } else {
        let message = `[ModuleImportPass] missing scope for: ${path}`
        throw new Error(message)
      }
    }
  }

  if (options.has("dump")) M.packageDumpFragments(rootPkg, "070-module-import")
}

function moduleImportStmt(
  scope: M.FragmentScope,
  stmt: M.Stmt<M.Term>,
): M.Stmt<M.Term> {
  switch (stmt.kind) {
    case "ClaimStmt": {
      return M.ClaimStmt(
        stmt.name,
        moduleImportTerm(scope, stmt.type),
        stmt.location,
      )
    }

    case "AdmitStmt": {
      return M.AdmitStmt(
        stmt.name,
        moduleImportTerm(scope, stmt.type),
        stmt.location,
      )
    }

    case "DefineFunctionStmt": {
      const boundNames = new Set(stmt.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.DefineFunctionStmt(
        stmt.name,
        stmt.parameters,
        moduleImportTerm(newScope, stmt.body),
        stmt.location,
      )
    }

    case "DefineVariableStmt": {
      return M.DefineVariableStmt(
        stmt.name,
        moduleImportTerm(scope, stmt.body),
        stmt.location,
      )
    }

    case "DefineTestStmt": {
      return M.DefineTestStmt(
        stmt.name,
        moduleImportTerm(scope, stmt.body),
        stmt.location,
      )
    }

    case "DefineTypeStmt": {
      return M.DefineTypeStmt(
        stmt.name,
        stmt.parameters,
        moduleImportTerm(scope, stmt.body),
        stmt.location,
      )
    }

    case "DefineAlgebraicTypeStmt": {
      const boundNames = new Set(stmt.typeConstructor.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      for (const ctor of stmt.dataConstructors) {
        ctor.fields = ctor.fields.map(
          (field: M.AlgebraicTypeField<M.Term>) => ({
            ...field,
            type: moduleImportTerm(newScope, field.type),
          }),
        )
      }
      return stmt
    }

    case "DefineOpaqueTypeStmt": {
      const boundNames = new Set(stmt.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.DefineOpaqueTypeStmt(
        stmt.name,
        stmt.parameters,
        moduleImportTerm(newScope, stmt.representationType),
        stmt.interfaceEntries.map((f) => ({
          ...f,
          type: moduleImportTerm(newScope, f.type),
        })),
        stmt.location,
      )
    }

    default: {
      return stmt
    }
  }
}

function moduleImportTerm(scope: M.FragmentScope, term: M.Term): M.Term {
  switch (term.kind) {
    case "VarTerm": {
      const entry = scope.importedNames.get(term.name)
      if (entry) {
        return M.QualifiedVarTerm(entry.pkgName, entry.modName, entry.name, term.location)
      } else {
        return term
      }
    }

    case "QualifiedVarTerm": {
      const entry = scope.importedPrefixes.get(term.modName)
      if (entry) {
        return M.QualifiedVarTerm(entry.pkgName, entry.modName, term.name, term.location)
      } else {
        return term
      }
    }

    case "LambdaTerm": {
      const boundNames = new Set(term.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.LambdaTerm(
        term.parameters,
        moduleImportTerm(newScope, term.body),
        term.location,
      )
    }

    case "PolymorphicTerm": {
      const boundNames = new Set(term.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.PolymorphicTerm(
        term.parameters,
        moduleImportTerm(newScope, term.body),
        term.location,
      )
    }

    case "Let1Term": {
      const boundNames = new Set([term.name])
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.Let1Term(
        term.name,
        moduleImportTerm(scope, term.rhs),
        moduleImportTerm(newScope, term.body),
        term.location,
      )
    }

    default: {
      return M.termTraverse((child) => moduleImportTerm(scope, child), term)
    }
  }
}

function scopeFilterBoundNames(
  scope: M.FragmentScope,
  boundNames: Set<string>,
): M.FragmentScope {
  const importedNames: Map<string, { pkgName: string; modName: string; name: string }> =
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
