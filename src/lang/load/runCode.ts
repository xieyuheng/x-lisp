import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { expFreeNames } from "../exp/index.ts"
import { formatValue } from "../format/index.ts"
import { modGet, type Def } from "../mod/index.ts"
import { modOwnDefs, type Mod } from "../mod/Mod.ts"
import { parseStmts } from "../parse/parse.ts"
import * as Values from "../value/index.ts"
import { handleDefine } from "./handleDefine.ts"
import { handleEffect } from "./handleEffect.ts"
import { handleImport } from "./handleImport.ts"

export function runCode(mod: Mod, code: string): void {
  const stmts = parseStmts(code)

  mod.code = mod.code + code
  mod.stmts = [...mod.stmts, ...stmts]

  for (const stmt of stmts) handleDefine(mod, stmt)
  for (const stmt of stmts) handleImport(mod, stmt)
  for (const def of modOwnDefs(mod)) assertNoUndefinedName(def)
  for (const stmt of stmts) handleEffect(mod, stmt)
}

function assertNoUndefinedName(def: Def): void {
  if (def.value.kind === "Lambda") {
    assertLambdaNoFreeName(def.value)
  }
}

function assertLambdaNoFreeName(lambda: Values.Lambda): void {
  const boundNames = new Set(lambda.parameters)
  const { freeNames } = expFreeNames(lambda.body)(boundNames)
  for (const name of freeNames) {
    if (!modGet(lambda.mod, name)) {
      let message =
        `[assertLambdaNoFreeName] I find undefined name: ${name}\n` +
        `  lambda: ${formatValue(lambda)}\n`
      message += `[source] ${urlRelativeToCwd(lambda.mod.url)}\n`
      throw new Error(message)
    }
  }
}
