import { flags } from "../../flags.ts"
import { fetchTextSync } from "../../utils/url/fetchTextSync.ts"
import { aboutModule } from "../builtin/aboutModule.ts"
import { importBuiltinPrelude } from "../builtin/index.ts"
import { createMod, type Mod } from "../mod/index.ts"
import { importStdPrelude } from "../std/importStdPrelude.ts"
import { runCode } from "./runCode.ts"

const globalLoadedMods: Map<string, Mod> = new Map()

export function load(url: URL): Mod {
  const found = globalLoadedMods.get(url.href)
  if (found !== undefined) return found

  const text = fetchTextSync(url)
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
