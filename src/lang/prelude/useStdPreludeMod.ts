import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createUrlOrFileUrl } from "../../utils/url/createUrlOrFileUrl.ts"
import { aboutModule } from "../builtin/aboutModule.ts"
import { importBuiltin } from "../builtin/importBuiltin.ts"
import { runCode } from "../load/index.ts"
import { createMod, type Mod } from "../mod/index.ts"

let mod: Mod | undefined = undefined

export function stdDirectory(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  return path.join(currentDir, "../../../std")
}

export function useStdPreludeMod(): Mod {
  if (mod) return mod

  const preludeFile = path.join(stdDirectory(), "prelude.lisp")
  const url = createUrlOrFileUrl(preludeFile)
  const text = fs.readFileSync(preludeFile, "utf-8")
  mod = createMod(url)
  aboutModule(mod)
  importBuiltin(mod)
  runCode(mod, text)
  return mod
}
