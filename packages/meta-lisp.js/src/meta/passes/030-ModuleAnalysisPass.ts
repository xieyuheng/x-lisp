import { writeln } from "@xieyuheng/helpers.js/file"
import { setDifference } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as M from "../index.ts"
import type { Outcome } from "../mod/Mod.ts"

export type ModuleAnalysisResult = {
  definedNames: NameGroupByMod
  privateNames: NameGroupByMod
  fragmentScopes: Map<string, FragmentScope>
  outcome: Outcome
}

type ModName = string
type Name = string
type PkgName = string
type Prefix = string

type NameGroupByMod = Map<ModName, Set<Name>>

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

  const fragmentScopes = new Map<string, FragmentScope>()
  const analysisResult: ModuleAnalysisResult = {
    definedNames,
    privateNames,
    fragmentScopes,
    outcome: "OutcomeOk",
  }

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const [path, fragment] of orderedPkg.fragments) {
      const scope = createFragmentScope()
      fragmentScopes.set(path, scope)
      for (const stmt of fragment.stmts) {
        const outcome = executeImport(
          orderedPkg,
          definedNames,
          privateNames,
          fragment.modName,
          scope,
          stmt,
        )

        if (outcome === "OutcomeError") {
          analysisResult.outcome = "OutcomeError"
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
): Outcome {
  if (stmt.kind === "ImportStmt") {
    const { pkgName, modName } = stmt
    if (!ensureModExists(pkg, pkgName, modName, stmt.location))
      return "OutcomeError"
    const importedModPrivateNames = lookupModPrivateNames(pkg, pkgName, modName)
    for (const name of stmt.names) {
      if (importedModPrivateNames.has(name)) continue
      scope.importedNames.set(name, { pkgName, modName, name })
    }
  }

  if (stmt.kind === "ImportAsStmt") {
    const { pkgName, modName } = stmt
    if (!ensureModExists(pkg, pkgName, modName, stmt.location))
      return "OutcomeError"
    scope.importedPrefixes.set(stmt.prefix, { pkgName, modName })
  }

  if (stmt.kind === "ImportAllStmt") {
    const { pkgName, modName } = stmt
    if (!ensureModExists(pkg, pkgName, modName, stmt.location))
      return "OutcomeError"
    const importedModPublicNames = lookupModPublicNames(pkg, pkgName, modName)
    for (const name of importedModPublicNames) {
      // - why: skip names already defined in the current module,
      //   so that local definitions can override imported ones.
      if (definedNames.get(currentModName)?.has(name)) continue
      scope.importedNames.set(name, { pkgName, modName, name })
    }
  }

  return "OutcomeOk"
}

function lookupPackage(pkg: M.Package, pkgName: PkgName): M.Package {
  if (pkgName === "self") {
    return pkg
  } else {
    const dependency = pkg.dependencies.get(pkgName)
    assert(dependency)
    return dependency
  }
}

function lookupModDefinedNames(
  pkg: M.Package,
  pkgName: PkgName,
  modName: ModName,
): Set<Name> {
  return (
    collectDefinedNames(lookupPackage(pkg, pkgName)).get(modName) ?? new Set()
  )
}

function lookupModPrivateNames(
  pkg: M.Package,
  pkgName: PkgName,
  modName: ModName,
): Set<Name> {
  return (
    collectPrivateNames(lookupPackage(pkg, pkgName)).get(modName) ?? new Set()
  )
}

function lookupModPublicNames(
  pkg: M.Package,
  pkgName: PkgName,
  modName: ModName,
): Set<Name> {
  return setDifference(
    lookupModDefinedNames(pkg, pkgName, modName),
    lookupModPrivateNames(pkg, pkgName, modName),
  )
}

function ensureModExists(
  pkg: M.Package,
  pkgName: PkgName,
  modName: ModName,
  location: S.SourceLocation,
): boolean {
  if (pkgName === "self") {
    for (const fragment of pkg.fragments.values()) {
      if (fragment.modName === modName) return true
    }

    writeln(S.sourceLocationReport(location, `undefined module: ${modName}`))
    return false
  } else {
    const dependency = pkg.dependencies.get(pkgName)
    if (!dependency) {
      writeln(S.sourceLocationReport(location, `undefined package: ${pkgName}`))
      return false
    }

    for (const fragment of dependency.fragments.values()) {
      if (fragment.modName === modName) return true
    }

    writeln(
      S.sourceLocationReport(
        location,
        `undefined module: ${pkgName}/${modName}`,
      ),
    )
    return false
  }
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
