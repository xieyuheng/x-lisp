import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createUrl } from "../../helpers/url/createUrl.ts"
import { builtinModule } from "../builtin/builtinModule.ts"
import { importBuiltin } from "../builtin/importBuiltin.ts"
import { runCode } from "../load/index.ts"
import { createMod, type Mod } from "../mod/index.ts"

let mod: Mod | undefined = undefined

export function usePreludeDirectory(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  return path.join(currentDir, "../../../lisp/prelude")
}

export function usePreludeMod(): Mod {
  if (mod) return mod

  const preludeFile = path.join(usePreludeDirectory(), "index.lisp")
  const url = createUrl(preludeFile)
  const text = fs.readFileSync(preludeFile, "utf-8")
  mod = createMod(url)
  builtinModule(mod)
  importBuiltin(mod)
  runCode(mod, text)
  return mod
}
