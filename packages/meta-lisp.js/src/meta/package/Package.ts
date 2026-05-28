import Path from "node:path"
import * as M from "../index.ts"

export type Package = {
  fragments: Map<string, M.ModFragment>
  mods: Map<string, M.Mod>
  rootDirectory: string
  config: M.PackageConfig
}

export function createPackage(
  rootDirectory: string,
  config: M.PackageConfig,
): Package {
  return {
    fragments: new Map(),
    mods: new Map(),
    rootDirectory,
    config,
  }
}

export function packageLookupMod(
  pkg: Package,
  name: string,
): M.Mod | undefined {
  return pkg.mods.get(name)
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
  return pkg.config["build"]["output-directory"]
    ? Path.resolve(pkg.rootDirectory, pkg.config["build"]["output-directory"])
    : packageSourceDirectory(pkg)
}

export function packageSnapshotDirectory(pkg: M.Package): string {
  return pkg.config["build"]["snapshot-directory"]
    ? Path.resolve(pkg.rootDirectory, pkg.config["build"]["snapshot-directory"])
    : packageSourceDirectory(pkg)
}
