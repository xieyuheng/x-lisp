import assert from "node:assert"
import fs from "node:fs"
import * as L from "../index.ts"

export function loadMod(url: URL, dependencyGraph: L.DependencyGraph): L.Mod {
  const found = L.dependencyGraphLookupMod(dependencyGraph, url)
  if (found !== undefined) return found

  const mod = L.createMod(url, dependencyGraph)
  L.dependencyGraphAddMod(dependencyGraph, mod)

  const builtinMod = L.loadBuiltinMod(dependencyGraph)
  for (const definition of builtinMod.definitions.values()) {
    L.modDefine(mod, definition.name, definition)
  }

  assert(url.protocol === "file:")
  const code = fs.readFileSync(url.pathname, "utf8")
  L.prepareCode(mod, code)
  return mod
}
