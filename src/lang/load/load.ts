import fs from "node:fs"
import Path from "node:path"
import { flags } from "../../flags.ts"
import { setDifference } from "../../utils/set/setAlgebra.ts"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { aboutModule } from "../builtin/aboutModule.ts"
import { importBuiltin } from "../builtin/index.ts"
import { createMod, type Mod } from "../mod/index.ts"
import { importPrelude } from "../prelude/importPrelude.ts"
import { useStdDirectory } from "../std/useStdDirectory.ts"
import { resolveModPath } from "./resolveModPath.ts"
import { runCode } from "./runCode.ts"

const globalLoadedMods: Map<string, Mod> = new Map()

export function load(url: URL): Mod {
  url = resolveToFileUrl(url)

  const found = globalLoadedMods.get(url.href)
  if (found !== undefined) return found

  const text = maybeIgnoreShebang(loadText(url))
  const mod = createMod(url)
  aboutModule(mod)
  importBuiltin(mod)
  if (!flags["no-prelude"]) {
    importPrelude(mod)
  }

  globalLoadedMods.set(url.href, mod)
  runCode(mod, text)
  checkExported(mod)
  return mod
}

function checkExported(mod: Mod): void {
  const definedNames = new Set(mod.defined.keys())
  const undefinedNames = setDifference(mod.exported, definedNames)
  if (undefinedNames.size > 0) {
    let message = `(export) undefined names: ${Array.from(undefinedNames).join(" ")}\n`
    message += `  mod: ${urlRelativeToCwd(mod.url)}\n`
    throw new Error(message)
  }
}

function resolveToFileUrl(url: URL): URL {
  if (url.protocol === "std:") {
    return new URL(
      `file:${resolveModPath(Path.join(useStdDirectory(), url.pathname))}`,
    )
  }

  return url
}

function loadText(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
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
