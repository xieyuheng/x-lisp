import Path from "node:path"
import * as M from "../index.ts"

export type Package = {
  id: string
  rootDirectory: string
  config: M.PackageConfig
  fragments: Map<string, M.ModFragment>
  mods: Map<string, M.Mod>
  dependencies: Map<string, M.Package>
}

export function createPackage(
  id: string,
  rootDirectory: string,
  config: M.PackageConfig,
): Package {
  return {
    id,
    rootDirectory,
    config,
    fragments: new Map(),
    mods: new Map(),
    dependencies: new Map(),
  }
}

export function packageLookupMod(
  pkg: Package,
  pkgId: string,
  modName: string,
): M.Mod | undefined {
  if (pkgId === pkg.id) {
    return pkg.mods.get(modName)
  }
  for (const dep of pkg.dependencies.values()) {
    if (dep.config.name === pkgId) {
      return dep.mods.get(modName)
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
  fragment: M.ModFragment,
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

export function packageSourceDirectory(pkg: M.Package): string {
  return Path.resolve(
    pkg.rootDirectory,
    pkg.config["build"]["source-directory"],
  )
}

export function packageOutputDirectory(pkg: M.Package): string {
  return Path.resolve(
    pkg.rootDirectory,
    pkg.config["build"]["output-directory"],
  )
}

export function packageSnapshotDirectory(pkg: M.Package): string {
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
