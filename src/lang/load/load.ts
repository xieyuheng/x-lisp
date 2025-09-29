import fs from "node:fs"
import path from "node:path"
import { flags } from "../../flags.ts"
import { aboutModule } from "../builtin/aboutModule.ts"
import { importBuiltinPrelude } from "../builtin/index.ts"
import { createMod, type Mod } from "../mod/index.ts"
import { importStdPrelude } from "../std/importStdPrelude.ts"
import { stdDirectory } from "../std/index.ts"
import { runCode } from "./runCode.ts"

const globalLoadedMods: Map<string, Mod> = new Map()

export function load(url: URL): Mod {
  const found = globalLoadedMods.get(url.href)
  if (found !== undefined) return found

  const text = maybeIgnoreShebang(loadText(url))
  const mod = createMod(url)
  aboutModule(mod)
  importBuiltinPrelude(mod)
  if (!flags["no-std-prelude"]) {
    importStdPrelude(mod)
  }

  globalLoadedMods.set(url.href, mod)
  runCode(mod, text)
  return mod
}

function loadText(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  if (url.protocol === "std:") {
    return fs.readFileSync(path.join(stdDirectory(), url.pathname), "utf8")
  }

  throw new Error(`[loadText] not supported protocol: ${url}`)
}

function maybeIgnoreShebang(text: string): string {
  if (!text.startsWith("#!")) {
    return text
  }

  const lines = text.split("\n")
  lines[0] = " ".repeat(lines[0].length)
  return lines.join("\n")
}
