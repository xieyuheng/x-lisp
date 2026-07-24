import Path from "node:path"
import type {
  Definition as CoreDefinition,
  Mod as CoreMod,
} from "../core/index.ts"
import * as M from "../meta/index.ts"
import { type PackageConfig } from "./PackageConfig.ts"

export type Package = {
  id: string
  rootDirectory: string
  config: PackageConfig
  fragments: Map<string, M.Fragment>
  mods: Map<string, M.Mod>
  coreMods: Map<string, CoreMod>
  dependencies: Map<string, Package>
}

export function createPackage(
  id: string,
  rootDirectory: string,
  config: PackageConfig,
): Package {
  return {
    id,
    rootDirectory,
    config,
    fragments: new Map(),
    mods: new Map(),
    coreMods: new Map(),
    dependencies: new Map(),
  }
}

export function packageLookupMod(
  pkg: Package,
  pkgName: string,
  modName: string,
): M.Mod | undefined {
  if (pkgName === pkg.id) {
    return pkg.mods.get(modName)
  }
  for (const dep of pkg.dependencies.values()) {
    if (dep.config.name === pkgName) {
      return dep.mods.get(modName)
    }
  }
  return undefined
}

export function packageLookupDefinition(
  pkg: Package,
  pkgName: string,
  modName: string,
  name: string,
): M.Definition | undefined {
  const qualifiedMod = packageLookupMod(pkg, pkgName, modName)
  if (qualifiedMod === undefined) {
    return undefined
  }

  return M.modLookupDefinition(qualifiedMod, name)
}

export function packageLookupCoreDefinition(
  pkg: Package,
  pkgName: string,
  modName: string,
  name: string,
): CoreDefinition | undefined {
  if (pkgName === pkg.id) {
    return pkg.coreMods.get(modName)?.definitions.get(name)
  }
  for (const dep of pkg.dependencies.values()) {
    if (dep.config.name === pkgName) {
      return dep.coreMods.get(modName)?.definitions.get(name)
    }
  }
  return undefined
}

export function packageAddMod(pkg: Package, mod: M.Mod): void {
  pkg.mods.set(mod.name, mod)
}

export function packagePutFragment(
  pkg: Package,
  path: string,
  fragment: M.Fragment,
): void {
  pkg.fragments.set(path, fragment)
}

export function packageMods(pkg: Package): Array<M.Mod> {
  return Array.from(pkg.mods.values())
}

export function packageModNames(pkg: Package): Array<string> {
  const mods = packageMods(pkg)
  return mods.map((mod) => mod.name)
}

export function packageSourceDirectory(pkg: Package): string {
  return Path.resolve(
    pkg.rootDirectory,
    pkg.config["build"]["source-directory"],
  )
}

export function packageOutputDirectory(pkg: Package): string {
  return Path.resolve(
    pkg.rootDirectory,
    pkg.config["build"]["output-directory"],
  )
}

export function packageSnapshotDirectory(pkg: Package): string {
  return Path.resolve(
    pkg.rootDirectory,
    pkg.config["build"]["snapshot-directory"],
  )
}

export function packageClosureInTopologicalOrder(pkg: Package): Array<Package> {
  const result: Array<Package> = []
  const seen = new Set<string>()
  function collect(pkg: Package): void {
    if (seen.has(pkg.id)) return
    seen.add(pkg.id)
    for (const dep of pkg.dependencies.values()) collect(dep)
    result.push(pkg)
  }
  collect(pkg)
  return result
}
