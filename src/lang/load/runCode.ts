import { setDifference, setUnion } from "../../utils/set/setAlgebra.ts"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { envNames } from "../env/index.ts"
import { expFreeNames } from "../exp/index.ts"
import { formatValue } from "../format/index.ts"
import {
  modNames,
  modOwnDefinitions,
  type Definition,
  type Mod,
} from "../mod/index.ts"
import { parseStmts } from "../parse/parse.ts"
import { stage1 } from "./stage1.ts"
import { stage2 } from "./stage2.ts"
import { stage3 } from "./stage3.ts"

export function runCode(mod: Mod, code: string): void {
  const stmts = parseStmts(code)

  mod.code = mod.code + code
  mod.stmts = [...mod.stmts, ...stmts]

  for (const stmt of stmts) stage1(mod, stmt)
  for (const stmt of stmts) stage2(mod, stmt)
  for (const definition of modOwnDefinitions(mod))
    assertNoUndefinedName(definition)
  for (const stmt of stmts) stage3(mod, stmt)
}

function assertNoUndefinedName(definition: Definition): void {
  if (definition.value.kind === "Lambda") {
    const lambda = definition.value
    const boundNames = new Set(lambda.parameters)
    const { freeNames } = expFreeNames(lambda.body)(boundNames)
    const definedNames = setUnion(modNames(lambda.mod), envNames(lambda.env))
    const undefinedNames = setDifference(freeNames, definedNames)
    if (undefinedNames.size > 0) {
      const unnamedLambda = { ...lambda, definedName: undefined }
      let message = `[assertNoUndefinedName] found undefined names in lambda\n`
      message += `  undefined names: [${Array.from(undefinedNames).join(" ")}]\n`
      message += `  lambda: ${formatValue(unnamedLambda)}\n`
      message += `  defining name: ${definition.name}\n`
      message += `[source] ${urlRelativeToCwd(lambda.mod.url)}\n`
      throw new Error(message)
    }
  }
}
