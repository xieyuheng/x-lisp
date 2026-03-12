import {
  callWithFile,
  fileRead,
  openInputFile,
} from "@xieyuheng/helpers.js/file"
import * as L from "../index.ts"

export function loadMod(
  path: string,
  dependencyGraph: L.DependencyGraph,
): L.Mod {
  const found = L.dependencyGraphLookupMod(dependencyGraph, path)
  if (found !== undefined) return found

  const mod = L.createMod(path, dependencyGraph)
  L.dependencyGraphAddMod(dependencyGraph, mod)

  const builtinMod = L.loadBuiltinMod(dependencyGraph)
  for (const definition of builtinMod.definitions.values()) {
    L.modDefine(mod, definition.name, definition)
  }
  callWithFile(openInputFile(path), (file) => {
    const code = fileRead(file)
    L.prepareCode(mod, code)
  })

  return mod
}
