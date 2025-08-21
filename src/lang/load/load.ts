import { ParsingError } from "@xieyuheng/x-data.js"
import { fetchTextSync } from "../../utils/url/fetchTextSync.ts"
import { createMod, type Mod } from "../mod/index.ts"
import { aboutModule } from "../prelude/aboutModule.ts"
import { importPrelude } from "../prelude/index.ts"
import { globalLoadedMods } from "./globalLoadedMods.ts"
import { runCode } from "./runCode.ts"

export function load(url: URL): Mod {
  const found = globalLoadedMods.get(url.href)
  if (found !== undefined) return found.mod

  const code = fetchTextSync(url)

  try {
    const mod = createMod(url)
    globalLoadedMods.set(url.href, { mod, text: code })
    importPrelude(mod)
    aboutModule(mod)
    runCode(mod, code)
    return mod
  } catch (error) {
    if (error instanceof ParsingError) {
      throw new Error(error.report())
    }

    throw error
  }
}
