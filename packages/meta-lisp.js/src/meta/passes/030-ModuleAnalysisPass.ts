import { writeln } from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

type ModName = string
type Name = string
type PkgName = string
type Prefix = string
type FilePath = string

type NameGroupByMod = Map<ModName, Set<Name>>

export type ModuleAnalysisResult = {
  definedNames: NameGroupByMod
  privateNames: NameGroupByMod
  fragmentScopes: Map<FilePath, FragmentScope>
  errorOccurred: boolean
}

export type FragmentScope = {
  importedNames: Map<Name, { pkgName: PkgName; modName: ModName; name: Name }>
  importedPrefixes: Map<Prefix, { pkgName: PkgName; modName: ModName }>
}

export function ModuleAnalysisPass(pkg: M.Package): ModuleAnalysisResult {
  const definedNames = new Map<ModName, Set<Name>>()
  const privateNames = new Map<ModName, Set<Name>>()
  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    mergeSetMap(definedNames, collectDefinedNames(orderedPkg))
    mergeSetMap(privateNames, collectPrivateNames(orderedPkg))
  }

  const fragmentScopes = new Map<FilePath, FragmentScope>()
  const analysisResult = {
    definedNames,
    privateNames,
    fragmentScopes,
    errorOccurred: false,
  }

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const [path, fragment] of orderedPkg.fragments) {
      const scope = createFragmentScope()
      fragmentScopes.set(path, scope)
      for (const stmt of fragment.stmts) {
        const errorOccurred = executeImport(
          orderedPkg,
          definedNames,
          privateNames,
          fragment.modName,
          scope,
          stmt,
        )

        if (errorOccurred) {
          analysisResult.errorOccurred = errorOccurred
        }
      }
    }
  }

  return analysisResult
}

function mergeSetMap<K, V>(
  target: Map<K, Set<V>>,
  source: Map<K, Set<V>>,
): void {
  for (const [key, values] of source) {
    let existing = target.get(key)
    if (!existing) {
      existing = new Set<V>()
      target.set(key, existing)
    }
    for (const v of values) existing.add(v)
  }
}

function createFragmentScope(): FragmentScope {
  return {
    importedNames: new Map(),
    importedPrefixes: new Map(),
  }
}

function executeImport(
  pkg: M.Package,
  definedNames: NameGroupByMod,
  privateNames: NameGroupByMod,
  currentModName: ModName,
  scope: FragmentScope,
  stmt: M.Stmt<M.Exp>,
): boolean {
  if (stmt.kind === "ImportStmt") {
    const { pkgName, modName } = stmt
    if (!ensureModExists(pkg, pkgName, modName, stmt.location)) return true

    const { privates } = lookupImportNames(
      pkg,
      definedNames,
      privateNames,
      pkgName,
      modName,
    )
    for (const name of stmt.names) {
      if (privates.has(name)) continue
      scope.importedNames.set(name, { pkgName, modName, name })
    }
  }

  if (stmt.kind === "ImportAsStmt") {
    const { pkgName, modName } = stmt
    if (!ensureModExists(pkg, pkgName, modName, stmt.location)) return true

    scope.importedPrefixes.set(stmt.prefix, { pkgName, modName })
  }

  if (stmt.kind === "ImportAllStmt") {
    const { pkgName, modName } = stmt
    if (!ensureModExists(pkg, pkgName, modName, stmt.location)) return true

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

  return false
}

function lookupImportNames(
  pkg: M.Package,
  definedNames: NameGroupByMod,
  privateNames: NameGroupByMod,
  pkgName: PkgName,
  modName: ModName,
): { names: Set<Name>; privates: Set<Name> } {
  if (pkgName !== "self" && pkgName !== pkg.id) {
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
  pkgName: PkgName,
  modName: ModName,
  location: S.SourceLocation,
): boolean {
  const target =
    pkgName === "self" || pkgName === pkg.id
      ? pkg
      : pkg.dependencies.get(pkgName)
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

  const fullModName =
    pkgName === "self" || pkgName === pkg.id ? modName : `${pkgName}/${modName}`
  const errorMessage = `undefined module: ${fullModName}`
  if (location) {
    writeln(S.sourceLocationReport(location, errorMessage))
  } else {
    writeln(`${modName} -- ${errorMessage}`)
  }

  return false
}

function collectNamesByMod(
  pkg: M.Package,
  extract: (fragment: M.ModFragment) => Array<Name>,
): NameGroupByMod {
  const result = new Map<ModName, Set<Name>>()
  for (const fragment of pkg.fragments.values()) {
    let names = result.get(fragment.modName)
    if (!names) {
      names = new Set()
      result.set(fragment.modName, names)
    }
    for (const name of extract(fragment)) {
      names.add(name)
    }
  }
  return result
}

function collectDefinedNames(pkg: M.Package): NameGroupByMod {
  return collectNamesByMod(pkg, (fragment) => [...M.modFragmentNames(fragment)])
}

function collectPrivateNames(pkg: M.Package): NameGroupByMod {
  return collectNamesByMod(pkg, (fragment) =>
    fragment.stmts
      .filter((stmt): stmt is M.PrivateStmt => stmt.kind === "PrivateStmt")
      .flatMap((stmt) => stmt.names),
  )
}
