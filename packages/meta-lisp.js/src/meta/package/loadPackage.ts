import Path from "node:path"
import * as M from "../index.ts"

export function loadPackage(configPath?: string): M.Package {
  configPath = configPath || Path.join(process.cwd(), "meta-package.json")
  const config = M.loadPackageConfig(configPath)
  const rootDirectory = Path.resolve(Path.dirname(configPath))
  const pkg = M.createPackage(rootDirectory, config)

  M.loadBuiltinMod(pkg)

  const sourceDirectory = M.packageSourceDirectory(pkg)
  M.packageLoadFragments(pkg, sourceDirectory)

  return pkg
}
