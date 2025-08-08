import { setDifference, setUnion } from "../../utils/set/setAlgebra.ts"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { envNames } from "../env/index.ts"
import { expFreeNames } from "../exp/index.ts"
import { formatValue } from "../format/index.ts"
import { modNames, modOwnDefs, type Def, type Mod } from "../mod/index.ts"
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
  const definedNames = setUnion(modNames(lambda.mod), envNames(lambda.env))
  const undefinedNames = setDifference(freeNames, definedNames)
  if (undefinedNames.size > 0) {
    let message =
      `[assertLambdaNoFreeName] fail\n` +
      `  undefined names: [${Array.from(undefinedNames).join(" ")}]\n` +
      `  lambda: ${formatValue(lambda)}\n`
    message += `[source] ${urlRelativeToCwd(lambda.mod.url)}\n`
    throw new Error(message)
  }
}
