import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))

export function loadBuiltinMod(project: M.Project): M.Mod {
  const builtinPath = Path.join(currentDir, "../../../../meta-builtin.meta/src")
  const modName = "builtin"
  const found = M.projectLookupMod(project, modName)
  if (found !== undefined) return found
  const mod = M.createMod(modName, project)
  M.projectAddMod(project, mod)
  M.typeBuiltin(mod)
  M.projectLoadModFragments(project, builtinPath)
  return mod
}
