import Path from "node:path"
import * as M from "../index.ts"

export function loadPackage(configPath: string): M.Package {
  const config = M.loadPackageConfig(configPath)
  const rootDirectory = Path.resolve(Path.dirname(configPath))

  if (config.name === "meta-builtin") {
    return M.loadBuiltinPackage()
  }

  const pkg = M.createPackage(rootDirectory, config)
  const builtinPkg = M.loadBuiltinPackage()
  pkg.dependencies.set("meta-builtin", builtinPkg)
  pkg.mods.set("builtin", builtinPkg.mods.get("builtin")!)
  for (const [path, fragment] of builtinPkg.fragments) {
    pkg.fragments.set(path, fragment)
  }

  for (const [alias, depPath] of Object.entries(config.dependencies)) {
    if (alias === "meta-builtin") continue
    const resolvedPath = Path.resolve(
      rootDirectory,
      depPath,
      "meta-package.json",
    )
    pkg.dependencies.set(alias, loadPackage(resolvedPath))
  }

  for (const pkgName of Object.keys(config.prelude)) {
    if (!pkg.dependencies.has(pkgName)) {
      throw new Error(
        `[loadPackage] prelude references unknown package: "${pkgName}"`,
      )
    }
  }

  const sourceDirectory = M.packageSourceDirectory(pkg)
  M.packageLoadFragments(pkg, sourceDirectory)
  return pkg
}
