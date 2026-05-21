import { writeln } from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ModuleAnalysisPass(project: M.Project): M.ModInfo {
  const definedNames = collectDefinedNames(project)
  const privateNames = collectPrivateNames(project)
  const fragmentScopes = new Map<string, M.FragmentScope>()

  for (const [path, fragment] of project.fragments) {
    const scope = createFragmentScope()
    fragmentScopes.set(path, scope)

    for (const stmt of fragment.stmts) {
      executeImport(
        project,
        definedNames,
        privateNames,
        fragment.modName,
        scope,
        stmt,
      )
    }
  }

  return { definedNames, privateNames, fragmentScopes }
}

function createFragmentScope(): M.FragmentScope {
  return {
    importedNames: new Map(),
    importedPrefixes: new Map(),
  }
}

function executeImport(
  project: M.Project,
  definedNames: Map<string, Set<string>>,
  privateNames: Map<string, Set<string>>,
  currentModName: string,
  scope: M.FragmentScope,
  stmt: M.Stmt,
): void {
  if (stmt.kind === "ImportStmt") {
    if (!ensureModExists(project, stmt.modName, stmt.location)) return

    const privates = privateNames.get(stmt.modName)
    for (const name of stmt.names) {
      if (privates?.has(name)) continue
      scope.importedNames.set(name, { modName: stmt.modName, name })
    }
  }

  if (stmt.kind === "ImportAsStmt") {
    if (!ensureModExists(project, stmt.modName, stmt.location)) return

    scope.importedPrefixes.set(stmt.prefix, { modName: stmt.modName })
  }

  if (stmt.kind === "ImportAllStmt") {
    if (!ensureModExists(project, stmt.modName, stmt.location)) return

    const names = definedNames.get(stmt.modName)
    const privates = privateNames.get(stmt.modName)

    if (names) {
      for (const name of names) {
        if (privates?.has(name)) continue

        // Skip names already defined in the current module,
        // so that local definitions can override imported ones.
        // This is especially important for the auto-injected
        // ImportAll("builtin") — if a module defines its own
        // version of a builtin name, the builtin import should
        // not shadow it.
        if (definedNames.get(currentModName)?.has(name)) continue

        scope.importedNames.set(name, { modName: stmt.modName, name })
      }
    }
  }
}

function ensureModExists(
  project: M.Project,
  modName: string,
  location: S.SourceLocation,
): boolean {
  for (const fragment of project.fragments.values()) {
    if (fragment.modName === modName) {
      return true
    }
  }

  const errorMessage = `undefined module: ${modName}`
  if (location) {
    writeln(S.sourceLocationReport(location, errorMessage))
  } else {
    writeln(`${modName} -- ${errorMessage}`)
  }

  return false
}

function collectDefinedNames(project: M.Project): Map<string, Set<string>> {
  const definedNames = new Map<string, Set<string>>()

  for (const fragment of project.fragments.values()) {
    let names = definedNames.get(fragment.modName)
    if (!names) {
      names = new Set()
      definedNames.set(fragment.modName, names)
    }

    for (const name of M.modFragmentNames(fragment)) {
      names.add(name)
    }
  }

  return definedNames
}

function collectPrivateNames(project: M.Project): Map<string, Set<string>> {
  const privateNames = new Map<string, Set<string>>()

  for (const fragment of project.fragments.values()) {
    let names = privateNames.get(fragment.modName)
    if (!names) {
      names = new Set()
      privateNames.set(fragment.modName, names)
    }

    for (const stmt of fragment.stmts) {
      if (stmt.kind === "PrivateStmt") {
        for (const name of stmt.names) {
          names.add(name)
        }
      }
    }
  }

  return privateNames
}
