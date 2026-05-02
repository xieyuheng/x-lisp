import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as M from "../index.ts"

export function ImportPass(project: M.Project): void {
  for (const fragment of project.fragments.values()) {
    const scope = createScope()
    for (const stmt of fragment.stmts) {
      scopeExecuteStmt(scope, stmt)
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

function scopeExecuteStmt(scope: Scope, stmt: M.Stmt): void {
  if (stmt.kind === "Import") {
    for (const name of stmt.names) {
      scope.importedNames.set(name, { modName: stmt.modName, name })
    }
  }

  if (stmt.kind === "ImportAs") {
    scope.importedPrefixes.set(stmt.prefix, { modName: stmt.modName })
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

function scopeDropImportedNames(scope: Scope): Scope {
  return {
    importedNames: new Map(),
    importedPrefixes: scope.importedPrefixes,
  }
}

function onStmt(scope: Scope, stmt: M.Stmt): M.Stmt {
  switch (stmt.kind) {
    case "Claim": {
      return M.Claim(stmt.name, onExp(scope, stmt.type), stmt.location)
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

    // no need to avoid free variable in lhs

    case "Lambda": {
      const newScope = scopeFilterBoundNames(scope, new Set(exp.parameters))
      return M.Lambda(exp.parameters, onExp(newScope, exp.body), exp.location)
    }

    case "Polymorphic": {
      const newScope = scopeFilterBoundNames(scope, new Set(exp.parameters))
      return M.Polymorphic(
        exp.parameters,
        onExp(newScope, exp.body),
        exp.location,
      )
    }

    case "Let1": {
      const newScope = scopeFilterBoundNames(scope, new Set([exp.name]))
      return M.Let1(
        exp.name,
        onExp(scope, exp.rhs),
        onExp(newScope, exp.body),
        exp.location,
      )
    }

    case "Match": {
      const targets = exp.targets.map((target) => onExp(scope, target))
      const clauses = exp.clauses.map((clause) =>
        M.MatchClause(
          clause.patterns,
          onExp(scopeDropImportedNames(scope), clause.body),
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
      return M.expTraverse((child) => onExp(scope, child), exp)
    }
  }
}
