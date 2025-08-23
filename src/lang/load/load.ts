import { ParsingError } from "@xieyuheng/x-data.js"
import { fetchTextSync } from "../../utils/url/fetchTextSync.ts"
import { aboutModule } from "../builtin/aboutModule.ts"
import { importBuiltinPrelude } from "../builtin/index.ts"
import { createMod, type Mod } from "../mod/index.ts"
import { importStdPrelude } from "../std/importStdPrelude.ts"
import { globalLoadedMods } from "./globalLoadedMods.ts"
import { runCode } from "./runCode.ts"

export function load(url: URL): Mod {
  const found = globalLoadedMods.get(url.href)
  if (found !== undefined) return found.mod

  const code = fetchTextSync(url)

  try {
    const mod = createMod(url)
    aboutModule(mod)
    importBuiltinPrelude(mod)
    importStdPrelude(mod)

    globalLoadedMods.set(url.href, { mod, text: code })
    runCode(mod, code)
    return mod
  } catch (error) {
    if (error instanceof ParsingError) {
      throw new Error(error.report())
    }

    throw error
  }
}
