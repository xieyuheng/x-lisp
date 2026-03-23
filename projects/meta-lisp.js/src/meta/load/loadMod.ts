import {
  callWithFile,
  fileRead,
  openInputFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"

export function loadMod(
  path: string,
  dependencyGraph: M.DependencyGraph,
): M.Mod {
  const found = M.dependencyGraphLookupMod(dependencyGraph, path)
  if (found !== undefined) return found

  const mod = M.createMod(path, dependencyGraph)
  M.dependencyGraphAddMod(dependencyGraph, mod)

  const builtinMod = M.loadBuiltinMod(dependencyGraph)
  for (const definition of builtinMod.definitions.values()) {
    M.modDefine(mod, definition.name, definition)
  }
  callWithFile(openInputFile(path), (file) => {
    const code = fileRead(file)
    M.prepareCode(mod, code)
  })

  return mod
}
