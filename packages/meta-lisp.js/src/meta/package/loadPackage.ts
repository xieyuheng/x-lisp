import Path from "node:path"
import * as M from "../index.ts"

const packageCache = new Map<string, M.Package>()

export function loadPackage(id: string, configPath: string): M.Package {
  const resolvedPath = Path.resolve(configPath)
  const cached = packageCache.get(resolvedPath)
  if (cached) return cached

  const config = M.loadPackageConfig(configPath)
  const rootDirectory = Path.resolve(Path.dirname(configPath))
  const pkg = M.createPackage(actualId(config, id), rootDirectory, config)

  if (config.name === "meta-builtin") setupBuiltinPackage(pkg)

  loadDependencies(pkg, rootDirectory, config)
  validateDependencies(pkg, config)

  M.packageLoadFragments(pkg, M.packageSourceDirectory(pkg))
  packageCache.set(resolvedPath, pkg)
  return pkg
}

function actualId(config: M.PackageConfig, id: string): string {
  return config.name === "meta-builtin" ? "meta-builtin" : id
}

function setupBuiltinPackage(pkg: M.Package): void {
  const mod = M.createMod("builtin", pkg)
  M.packageAddMod(pkg, mod)
  M.typeBuiltin(mod)
}

function loadDependencies(
  pkg: M.Package,
  rootDirectory: string,
  config: M.PackageConfig,
): void {
  for (const [alias, depPath] of Object.entries(config.dependencies)) {
    const depConfigPath = Path.resolve(
      rootDirectory,
      depPath,
      "meta-package.json",
    )
    const depId =
      alias === "meta-builtin"
        ? "meta-builtin"
        : M.computePackageHashFromConfig(depConfigPath)
    pkg.dependencies.set(alias, loadPackage(depId, depConfigPath))
  }
}

function validateDependencies(
  pkg: M.Package,
  config: M.PackageConfig,
): void {
  if (
    config.name !== "meta-builtin" &&
    !("meta-builtin" in config.dependencies)
  ) {
    throw new Error(
      `[loadPackage] missing required dependency "meta-builtin"`,
    )
  }

  for (const pkgName of Object.keys(config.prelude)) {
    if (!pkg.dependencies.has(pkgName)) {
      throw new Error(
        `[loadPackage] prelude references unknown package: "${pkgName}"`,
      )
    }
  }
}
