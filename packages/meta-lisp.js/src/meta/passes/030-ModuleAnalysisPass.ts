import { writeln } from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

// ModuleAnalysisResult = {
//   definedNames:    Map<modName, Set<name>>     // 每个模块定义了哪些名字
//   privateNames:    Map<modName, Set<name>>     // 每个模块的私有名字
//   fragmentScopes:  Map<path, FragmentScope>    // 每个源文件的解析后 import 信息
//   errorOccurred:   boolean                     // 是否有 import 错误
// }

export type ModuleAnalysisResult = {
  definedNames: Map<string, Set<string>>
  privateNames: Map<string, Set<string>>
  fragmentScopes: Map<string, FragmentScope>
  errorOccurred: boolean
}

// FragmentScope = {
//   importedNames:   Map<name, {pkgName, modName, name}>   // 直接按名 import
//   importedPrefixes: Map<prefix, {pkgName, modName}>      // prefix import (as)
// }

export type FragmentScope = {
  importedNames: Map<string, { pkgName: string; modName: string; name: string }>
  importedPrefixes: Map<string, { pkgName: string; modName: string }>
}

export function ModuleAnalysisPass(pkg: M.Package): ModuleAnalysisResult {
  const definedNames = new Map<string, Set<string>>()
  const privateNames = new Map<string, Set<string>>()
  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const [modName, names] of collectDefinedNames(orderedPkg)) {
      let existing = definedNames.get(modName)
      if (!existing) {
        existing = new Set()
        definedNames.set(modName, existing)
      }
      for (const n of names) existing.add(n)
    }
    for (const [modName, names] of collectPrivateNames(orderedPkg)) {
      let existing = privateNames.get(modName)
      if (!existing) {
        existing = new Set()
        privateNames.set(modName, existing)
      }
      for (const n of names) existing.add(n)
    }
  }
  const fragmentScopes = new Map<string, FragmentScope>()

  let errorOccurred = false

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const [path, fragment] of orderedPkg.fragments) {
      const scope = createFragmentScope()
      fragmentScopes.set(path, scope)

      for (const stmt of fragment.stmts) {
        if (
          executeImport(
            orderedPkg,
            definedNames,
            privateNames,
            fragment.modName,
            scope,
            stmt,
          )
        )
          errorOccurred = true
      }
    }
  }

  return { definedNames, privateNames, fragmentScopes, errorOccurred }
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
  definedNames: Map<string, Set<string>>,
  privateNames: Map<string, Set<string>>,
  pkgName: string,
  modName: string,
): { names: Set<string>; privates: Set<string> } {
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
  pkgName: string,
  modName: string,
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
