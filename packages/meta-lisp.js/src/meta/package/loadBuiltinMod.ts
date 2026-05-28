import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))

export function loadBuiltinMod(pkg: M.Package): M.Mod {
  const builtinPath = Path.join(currentDir, "../../../../meta-builtin.meta/src")
  const modName = "builtin"
  const found = M.packageLookupMod(pkg, modName)
  if (found !== undefined) return found
  const mod = M.createMod(modName, pkg)
  M.packageAddMod(pkg, mod)
  M.typeBuiltin(mod)
  M.packageLoadFragments(pkg, builtinPath)
  return mod
}

export function isBuiltinMod(mod: M.Mod): boolean {
  return mod === loadBuiltinMod(mod.pkg)
}

export function isBuiltinPackage(pkg: M.Package): boolean {
  return pkg.config.name === "meta-builtin.meta"
}
