import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { expFreeNames } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modGet, type Def } from "../mod/index.ts"
import { modOwnDefs, type Mod } from "../mod/Mod.ts"
import { parseStmts } from "../parse/parse.ts"
import { handleDefine } from "./handleDefine.ts"
import { handleEffect } from "./handleEffect.ts"
import { handleImport } from "./handleImport.ts"

export function runCode(mod: Mod, code: string): void {
  const stmts = parseStmts(code)

  mod.code = mod.code + code
  mod.stmts = [...mod.stmts, ...stmts]

  for (const stmt of stmts) handleDefine(mod, stmt)
  for (const stmt of stmts) handleImport(mod, stmt)
  for (const def of modOwnDefs(mod)) assertNoUndefinedName(mod, def)
  for (const stmt of stmts) handleEffect(mod, stmt)
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
