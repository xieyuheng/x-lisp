import { writeln } from "@xieyuheng/helpers.js/file"
import { setDifference } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import fs from "node:fs"
import Path from "node:path"
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
  modName: ModName
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
      const scope = createFragmentScope(fragment.modName)
      fragmentScopes.set(path, scope)
      for (const stmt of fragment.stmts) {
        if (ensureImportedModExists(orderedPkg, stmt) === "OutcomeError") {
          analysisResult.outcome = "OutcomeError"
        } else {
          executeImport(orderedPkg, scope, stmt)
        }
      }
    }
  }

  if (pkg.config.compiler.dump) {
    dumpModuleAnalysisResult(analysisResult, pkg)
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

function createFragmentScope(modName: ModName): FragmentScope {
  return {
    modName,
    importedNames: new Map(),
    importedPrefixes: new Map(),
  }
}

function executeImport(
  pkg: M.Package,
  scope: FragmentScope,
  stmt: M.Stmt<M.Exp>,
): void {
  switch (stmt.kind) {
    case "ImportStmt": {
      const { pkgName, modName } = stmt
      const importedModPrivateNames = lookupModPrivateNames(
        pkg,
        pkgName,
        modName,
      )
      for (const name of stmt.names) {
        if (importedModPrivateNames.has(name)) continue
        scope.importedNames.set(name, { pkgName, modName, name })
      }
      return
    }

    case "ImportAsStmt": {
      const { pkgName, modName } = stmt
      scope.importedPrefixes.set(stmt.prefix, { pkgName, modName })
      return
    }

    case "ImportAllStmt": {
      const { pkgName, modName } = stmt
      const importedModPublicNames = lookupModPublicNames(pkg, pkgName, modName)
      const currentModDefinedNames = lookupModDefinedNames(
        pkg,
        "self",
        scope.modName,
      )
      for (const name of importedModPublicNames) {
        // - why: skip names already defined in the current module,
        //   so that local definitions can override imported ones.
        if (currentModDefinedNames.has(name)) continue
        scope.importedNames.set(name, { pkgName, modName, name })
      }
      return
    }
  }
}

function ensureImportedModExists(pkg: M.Package, stmt: M.Stmt<M.Exp>): Outcome {
  switch (stmt.kind) {
    case "ImportStmt":
    case "ImportAsStmt":
    case "ImportAllStmt": {
      return ensureModExists(pkg, stmt.pkgName, stmt.modName, stmt.location)
    }
    default: {
      return "OutcomeOk"
    }
  }
}

function ensureModExists(
  pkg: M.Package,
  pkgName: PkgName,
  modName: ModName,
  location: S.SourceLocation,
): Outcome {
  if (pkgName === "self") {
    for (const fragment of pkg.fragments.values()) {
      if (fragment.modName === modName) return "OutcomeOk"
    }

    writeln(S.sourceLocationReport(location, `undefined module: ${modName}`))
    return "OutcomeError"
  } else {
    const dependency = pkg.dependencies.get(pkgName)
    if (!dependency) {
      writeln(S.sourceLocationReport(location, `undefined package: ${pkgName}`))
      return "OutcomeError"
    }

    for (const fragment of dependency.fragments.values()) {
      if (fragment.modName === modName) return "OutcomeOk"
    }

    writeln(
      S.sourceLocationReport(
        location,
        `undefined module: ${pkgName}/${modName}`,
      ),
    )
    return "OutcomeError"
  }
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

function collectNamesByMod(
  pkg: M.Package,
  extract: (fragment: M.Fragment) => Array<Name>,
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
  return collectNamesByMod(pkg, (fragment) => [...M.fragmentNames(fragment)])
}

function collectPrivateNames(pkg: M.Package): NameGroupByMod {
  return collectNamesByMod(pkg, (fragment) =>
    fragment.stmts
      .filter((stmt): stmt is M.PrivateStmt => stmt.kind === "PrivateStmt")
      .flatMap((stmt) => stmt.names),
  )
}

function dumpModuleAnalysisResult(
  result: ModuleAnalysisResult,
  pkg: M.Package,
): void {
  const dir = Path.join(M.packageOutputDirectory(pkg), "dump")
  fs.mkdirSync(dir, { recursive: true })
  const file = Path.join(dir, "030-module-analysis-result.dump")
  const content = formatModuleAnalysisResult(result)
  fs.writeFileSync(file, content + "\n", "utf-8")
}

function formatModuleAnalysisResult(result: ModuleAnalysisResult): string {
  const lines: Array<string> = []
  lines.push("(module-analysis-result")

  lines.push("  (defined-names")
  for (const [modName, names] of [...result.definedNames].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    lines.push(`    (${modName} ${names.size})`)
  }
  closeTop(lines)

  lines.push("  (private-names")
  for (const [modName, names] of [...result.privateNames].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    lines.push(`    (${modName} ${names.size})`)
  }
  closeTop(lines)

  lines.push("  (fragment-scopes")
  for (const [path, scope] of [...result.fragmentScopes].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    lines.push(`    ("${path}"`)
    lines.push(`      (mod-name ${scope.modName})`)
    lines.push(`      (imported-names ${scope.importedNames.size})`)
    lines.push(`      (imported-prefixes ${scope.importedPrefixes.size})`)
    closeTop(lines)
  }
  closeTop(lines)

  closeTop(lines)
  return lines.join("\n")
}

function closeTop(lines: Array<string>): void {
  const i = lines.length - 1
  lines[i] = lines[i] + ")"
}
