import fs from "node:fs"
import * as L from "../index.ts"

export function loadEntry(url: URL): L.Mod {
  return load(url, new Map())
}

export function load(url: URL, dependencies: Map<string, L.Mod>): L.Mod {
  const found = dependencies.get(url.href)
  if (found !== undefined) return found

  const code = loadCode(url)
  const mod = L.createMod(url, dependencies)
  dependencies.set(url.href, mod)

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
