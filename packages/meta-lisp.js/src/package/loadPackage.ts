import Path from "node:path"
import * as M from "../meta/index.ts"
import {
  type Package,
  createPackage,
  packageAddMod,
  packageSourceDirectory,
} from "./Package.ts"
import { type PackageConfig } from "./PackageConfig.ts"
import { loadPackageConfig } from "./loadPackageConfig.ts"
import { packageLoadFragments } from "./packageLoadFragments.ts"

const packageCache = new Map<string, Package>()
const packageSerialNumbers = new Map<string, string>()

function dependencyId(depConfigPath: string): string {
  const resolvedPath = Path.resolve(depConfigPath)
  const existing = packageSerialNumbers.get(resolvedPath)
  if (existing !== undefined) return existing
  const id = `pkg-${packageSerialNumbers.size}`
  packageSerialNumbers.set(resolvedPath, id)
  return id
}

export function loadPackage(id: string, configPath: string): Package {
  const resolvedPath = Path.resolve(configPath)
  const cached = packageCache.get(resolvedPath)
  if (cached) return cached

  const config = loadPackageConfig(configPath)
  const rootDirectory = Path.resolve(Path.dirname(configPath))
  const pkg = createPackage(actualId(config, id), rootDirectory, config)

  if (config.name === "meta-builtin") setupBuiltinPackage(pkg)

  loadDependencies(pkg, rootDirectory, config)
  validateDependencies(pkg, config)

  packageLoadFragments(pkg, packageSourceDirectory(pkg))
  packageCache.set(resolvedPath, pkg)
  return pkg
}

function actualId(config: PackageConfig, id: string): string {
  return config.name === "meta-builtin" ? "meta-builtin" : id
}

function setupBuiltinPackage(pkg: Package): void {
  M.setupPrimitive()
  const mod = M.createMod("builtin", pkg)
  packageAddMod(pkg, mod)
}

function loadDependencies(
  pkg: Package,
  rootDirectory: string,
  config: PackageConfig,
): void {
  for (const [alias, depPath] of Object.entries(config.dependencies)) {
    const depConfigPath = Path.resolve(
      rootDirectory,
      depPath,
      "meta-package.json",
    )
    const depId =
      alias === "meta-builtin" ? "meta-builtin" : dependencyId(depConfigPath)
    pkg.dependencies.set(alias, loadPackage(depId, depConfigPath))
  }
}

function validateDependencies(pkg: Package, config: PackageConfig): void {
  if (
    config.name !== "meta-builtin" &&
    !("meta-builtin" in config.dependencies)
  ) {
    throw new Error(`[loadPackage] missing required dependency "meta-builtin"`)
  }

  for (const pkgName of Object.keys(config.prelude)) {
    if (!pkg.dependencies.has(pkgName)) {
      throw new Error(
        `[loadPackage] prelude references unknown package: "${pkgName}"`,
      )
    }
  }
}
