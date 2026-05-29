import { writeln } from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export type ModInfo = {
  definedNames: Map<string, Set<string>>
  privateNames: Map<string, Set<string>>
  fragmentScopes: Map<string, FragmentScope>
}

export type FragmentScope = {
  importedNames: Map<string, { pkgName: string; modName: string; name: string }>
  importedPrefixes: Map<string, { pkgName: string; modName: string }>
}

export function ModuleAnalysisPass(pkg: M.Package): ModInfo {
  const definedNames = collectDefinedNames(pkg)
  const privateNames = collectPrivateNames(pkg)
  const fragmentScopes = new Map<string, FragmentScope>()

  for (const [path, fragment] of pkg.fragments) {
    const scope = createFragmentScope()
    fragmentScopes.set(path, scope)

    for (const stmt of fragment.stmts) {
      executeImport(
        pkg,
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

function createFragmentScope(): FragmentScope {
  return {
    importedNames: new Map(),
    importedPrefixes: new Map(),
  }
}

function executeImport(
  pkg: M.Package,
  definedNames: Map<string, Set<string>>,
  privateNames: Map<string, Set<string>>,
  currentModName: string,
  scope: FragmentScope,
  stmt: M.Stmt<M.Exp>,
): void {
  if (stmt.kind === "ImportStmt") {
    if (!ensureModExists(pkg, "self", stmt.modName, stmt.location)) return

    const privates = privateNames.get(stmt.modName)
    for (const name of stmt.names) {
      if (privates?.has(name)) continue
      scope.importedNames.set(name, { pkgName: "self", modName: stmt.modName, name })
    }
  }

  if (stmt.kind === "ImportAsStmt") {
    if (!ensureModExists(pkg, "self", stmt.modName, stmt.location)) return

    scope.importedPrefixes.set(stmt.prefix, { pkgName: "self", modName: stmt.modName })
  }

  if (stmt.kind === "ImportAllStmt") {
    const { pkgName, modName } = parseImportModName(stmt.modName)
    if (!ensureModExists(pkg, pkgName, modName, stmt.location)) return

    const { names, privates } = lookupImportNames(
      pkg,
      definedNames,
      privateNames,
      pkgName,
      modName,
    )

    for (const name of names) {
      if (privates.has(name)) continue
      // Skip names already defined in the current module,
      // so that local definitions can override imported ones.
      if (definedNames.get(currentModName)?.has(name)) continue

      scope.importedNames.set(name, { pkgName, modName, name })
    }
  }
}

function parseImportModName(
  rawModName: string,
): { pkgName: string; modName: string } {
  const slashIndex = rawModName.indexOf("/")
  if (slashIndex === -1) {
    return { pkgName: "self", modName: rawModName }
  }
  return {
    pkgName: rawModName.slice(0, slashIndex),
    modName: rawModName.slice(slashIndex + 1),
  }
}

function lookupImportNames(
  pkg: M.Package,
  definedNames: Map<string, Set<string>>,
  privateNames: Map<string, Set<string>>,
  pkgName: string,
  modName: string,
): { names: Set<string>; privates: Set<string> } {
  if (pkgName !== "self") {
    const target = pkg.dependencies.get(pkgName)!
    return {
      names: collectDefinedNames(target).get(modName) ?? new Set(),
      privates: collectPrivateNames(target).get(modName) ?? new Set(),
    }
  }
  return {
    names: definedNames.get(modName) ?? new Set(),
    privates: privateNames.get(modName) ?? new Set(),
  }
}

function ensureModExists(
  pkg: M.Package,
  pkgName: string,
  modName: string,
  location: S.SourceLocation,
): boolean {
  const target = pkgName === "self" ? pkg : pkg.dependencies.get(pkgName)
  if (!target) {
    const errorMessage = `undefined package: ${pkgName}`
    if (location) {
      writeln(S.sourceLocationReport(location, errorMessage))
    } else {
      writeln(`${pkgName}/${modName} -- ${errorMessage}`)
    }
    return false
  }

  for (const fragment of target.fragments.values()) {
    if (fragment.modName === modName) {
      return true
    }
  }

  const fullModName = pkgName === "self" ? modName : `${pkgName}/${modName}`
  const errorMessage = `undefined module: ${fullModName}`
  if (location) {
    writeln(S.sourceLocationReport(location, errorMessage))
  } else {
    writeln(`${modName} -- ${errorMessage}`)
  }

  return false
}

function collectDefinedNames(pkg: M.Package): Map<string, Set<string>> {
  const definedNames = new Map<string, Set<string>>()

  for (const fragment of pkg.fragments.values()) {
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

function collectPrivateNames(pkg: M.Package): Map<string, Set<string>> {
  const privateNames = new Map<string, Set<string>>()

  for (const fragment of pkg.fragments.values()) {
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
