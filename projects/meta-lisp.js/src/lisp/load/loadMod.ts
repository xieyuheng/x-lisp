import fs from "node:fs"
import * as L from "../index.ts"

export function loadMod(url: URL, dependencyGraph: L.DependencyGraph): L.Mod {
  const found = L.dependencyGraphLookupMod(dependencyGraph, url)
  if (found !== undefined) return found

  const code = loadCode(url)
  const mod = L.createMod(url, dependencyGraph)
  L.dependencyGraphAddMod(dependencyGraph, mod)
  importBuiltinMod(mod)
  L.runCode(mod, code)
  return mod
}

function importBuiltinMod(mod: L.Mod): void {
  const builtinMod = L.loadBuiltinMod()
  for (const definition of builtinMod.definitions.values()) {
    L.modDefine(mod, definition.name, definition)
  }
}

function loadCode(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[loadCode] not supported protocol: ${url}`)
}
