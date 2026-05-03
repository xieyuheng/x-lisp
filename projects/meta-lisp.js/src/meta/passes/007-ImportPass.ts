import { recordMapValue } from "@xieyuheng/helpers.js/record"
import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"

export function ImportPass(project: M.Project): void {
  for (const fragment of project.fragments.values()) {
    if (fragment.modName !== "builtin") {
      fragment.stmts.unshift(M.ImportAll("builtin"))
    }

    const scope = createScope()
    for (const stmt of fragment.stmts) {
      executeImport(project, scope, stmt)
    }

    fragment.stmts = fragment.stmts.map((stmt) => onStmt(scope, stmt))
  }
}

type Scope = {
  importedNames: Map<string, { modName: string; name: string }>
  importedPrefixes: Map<string, { modName: string }>
}

function createScope(): Scope {
  return {
    importedNames: new Map(),
    importedPrefixes: new Map(),
  }
}

function executeImport(project: M.Project, scope: Scope, stmt: M.Stmt): void {
  if (stmt.kind === "Import") {
    for (const name of stmt.names) {
      scope.importedNames.set(name, { modName: stmt.modName, name })
    }
  }

  if (stmt.kind === "ImportAs") {
    scope.importedPrefixes.set(stmt.prefix, { modName: stmt.modName })
  }

  if (stmt.kind === "ImportAll") {
    const names = new Set<string>()
    for (const fragment of project.fragments.values()) {
      if (fragment.modName === stmt.modName) {
        for (const name of M.modFragmentNames(fragment)) {
          names.add(name)
        }
      }
    }

    for (const name of names) {
      scope.importedNames.set(name, { modName: stmt.modName, name })
    }
  }
}

function scopeFilterBoundNames(scope: Scope, boundNames: Set<string>): Scope {
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

function onStmt(scope: Scope, stmt: M.Stmt): M.Stmt {
  switch (stmt.kind) {
    case "Claim": {
      return M.Claim(stmt.name, onExp(scope, stmt.type), stmt.location)
    }

    case "Admit": {
      return M.Admit(stmt.name, onExp(scope, stmt.type), stmt.location)
    }

    case "DefineFunction": {
      const boundNames = new Set(stmt.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.DefineFunction(
        stmt.name,
        stmt.parameters,
        onExp(newScope, stmt.body),
        stmt.location,
      )
    }

    case "DefineVariable": {
      return M.DefineVariable(stmt.name, onExp(scope, stmt.body), stmt.location)
    }

    case "DefineTest": {
      return M.DefineTest(stmt.name, onExp(scope, stmt.body), stmt.location)
    }

    case "DefineType": {
      return M.DefineType(
        stmt.name,
        stmt.parameters,
        onExp(scope, stmt.body),
        stmt.location,
      )
    }

    case "DefineData": {
      const boundNames = new Set(stmt.dataTypeConstructor.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      for (const dataConstructor of stmt.dataConstructors) {
        dataConstructor.fields = dataConstructor.fields.map((field) => ({
          name: field.name,
          type: onExp(newScope, field.type),
        }))
      }

      return stmt
    }

    case "DefineInterface": {
      const boundNames = new Set(stmt.interfaceConstructor.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      stmt.attributeTypes = recordMapValue(stmt.attributeTypes, (type) =>
        onExp(newScope, type),
      )
      return stmt
    }

    default: {
      return stmt
    }
  }
}

function onExp(scope: Scope, exp: M.Exp): M.Exp {
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

    case "Lambda": {
      const boundNames = new Set(exp.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.Lambda(exp.parameters, onExp(newScope, exp.body), exp.location)
    }

    case "Polymorphic": {
      const boundNames = new Set(exp.parameters)
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.Polymorphic(
        exp.parameters,
        onExp(newScope, exp.body),
        exp.location,
      )
    }

    case "Let1": {
      const boundNames = new Set([exp.name])
      const newScope = scopeFilterBoundNames(scope, boundNames)
      return M.Let1(
        exp.name,
        onExp(scope, exp.rhs),
        onExp(newScope, exp.body),
        exp.location,
      )
    }

    case "Match": {
      return M.Match(
        exp.targets.map((target) => onExp(scope, target)),
        exp.clauses.map((clause) => {
          const boundNames = setUnionMany(
            clause.patterns.map(M.patternBoundNames),
          )
          const newScope = scopeFilterBoundNames(scope, boundNames)
          return M.MatchClause(
            clause.patterns.map((pattern) => onExp(newScope, pattern)),
            onExp(newScope, clause.body),
            clause.location,
          )
        }),
        exp.location,
      )
    }

    default: {
      return M.expTraverse((child) => onExp(scope, child), exp)
    }
  }
}
