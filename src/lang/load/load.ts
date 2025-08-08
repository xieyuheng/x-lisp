import { ParsingError } from "@xieyuheng/x-data.js"
import { fetchText } from "../../utils/url/fetchText.ts"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { expFreeNames } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import {
  createMod,
  modGet,
  modOwnDefs,
  type Def,
  type Mod,
} from "../mod/index.ts"
import { parseStmts } from "../parse/index.ts"
import { requirePrelude } from "../prelude/index.ts"
import { globalLoadedMods } from "./globalLoadedMods.ts"
import { handleDefine } from "./handleDefine.ts"
import { handleEffect } from "./handleEffect.ts"
import { handleImport } from "./handleImport.ts"

export async function load(url: URL): Promise<Mod> {
  const found = globalLoadedMods.get(url.href)
  if (found !== undefined) return found.mod

  const code = await fetchText(url)

  try {
    const mod = createMod(url)
    globalLoadedMods.set(url.href, { mod, text: code })
    await requirePrelude(mod)
    await runCode(mod, code)
    return mod
  } catch (error) {
    if (error instanceof ParsingError) {
      throw new Error(error.report({ text: code }))
    }

    throw error
  }
}

export async function runCode(mod: Mod, code: string): Promise<void> {
  const stmts = parseStmts(code)

  mod.code = mod.code + code
  mod.stmts = [...mod.stmts, ...stmts]

  for (const stmt of stmts) await handleDefine(mod, stmt)
  for (const stmt of stmts) await handleImport(mod, stmt)
  for (const def of modOwnDefs(mod)) assertNoUndefinedName(mod, def)
  for (const stmt of stmts) await handleEffect(mod, stmt)
}

function assertNoUndefinedName(mod: Mod, def: Def): void {
  if (def.value.kind === "Lazy") {
    const lazy = def.value
    const { freeNames } = expFreeNames(lazy.exp)(new Set())
    for (const name of freeNames) {
      if (!modGet(mod, name)) {
        throw new Error(
          `[load] I find undefined name: ${name}\n` +
            `  defining: ${def.name}\n` +
            `  to: : ${formatExp(lazy.exp)}\n` +
            `[source] ${urlRelativeToCwd(mod.url)}\n`,
        )
      }
    }
  }
}
