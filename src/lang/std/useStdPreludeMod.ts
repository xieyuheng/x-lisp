import path from "node:path"
import { fileURLToPath } from "node:url"
import { createUrlOrFileUrl } from "../../utils/url/createUrlOrFileUrl.ts"
import { fetchTextSync } from "../../utils/url/fetchTextSync.ts"
import { aboutModule } from "../builtin/aboutModule.ts"
import { importBuiltinPrelude } from "../builtin/importBuiltinPrelude.ts"
import { runCode } from "../load/index.ts"
import { createMod, type Mod } from "../mod/index.ts"

let mod: Mod | undefined = undefined

export function useStdPreludeMod(): Mod {
  if (mod) return mod

  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  const preludeFile = path.join(currentDir, "../../../std/prelude.lisp")
  const url = createUrlOrFileUrl(preludeFile)
  const text = fetchTextSync(url)
  mod = createMod(url)
  aboutModule(mod)
  importBuiltinPrelude(mod)
  runCode(mod, text)
  return mod
}
