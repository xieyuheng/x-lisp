import fs from "node:fs"
import { createMod, type Mod } from "../mod/index.ts"
import { runCode } from "./runCode.ts"

const globalLoadedMods: Map<string, Mod> = new Map()

export function load(url: URL): Mod {
  const found = globalLoadedMods.get(url.href)
  if (found !== undefined) return found

  const text = loadText(url)
  const mod = createMod(url)
  globalLoadedMods.set(url.href, mod)
  runCode(mod, text)
  console.dir(mod, { depth: null })
  return mod
}

function loadText(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[loadText] not supported protocol: ${url}`)
}
