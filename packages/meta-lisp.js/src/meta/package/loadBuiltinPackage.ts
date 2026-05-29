import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))

let cached: M.Package | undefined

export function loadBuiltinPackage(): M.Package {
  if (cached) return cached

  const builtinConfigPath = Path.join(
    currentDir,
    "../../../../meta-builtin.meta/meta-package.json",
  )
  const config = M.loadPackageConfig(builtinConfigPath)
  const rootDirectory = Path.resolve(Path.dirname(builtinConfigPath))
  const pkg = M.createPackage("meta-builtin", rootDirectory, config)

  const mod = M.createMod("builtin", pkg)
  M.packageAddMod(pkg, mod)
  M.typeBuiltin(mod)

  const sourceDirectory = M.packageSourceDirectory(pkg)
  M.packageLoadFragments(pkg, sourceDirectory)

  cached = pkg
  return pkg
}
