import fs from "node:fs"
import * as L from "../index.ts"

type Options = { noBuiltin?: boolean }

export function load(url: URL, dependencyGraph: L.DependencyGraph): L.Mod {
  const found = L.dependencyGraphLookupMod(dependencyGraph, url)
  if (found !== undefined) return found

  const code = loadCode(url)
  const mod = L.createMod(url, dependencyGraph)
  L.dependencyGraphAddMod(dependencyGraph, mod)
  L.importBuiltinMod(mod)
  L.runCode(mod, code)
  return mod
}

function loadCode(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[loadCode] not supported protocol: ${url}`)
}
