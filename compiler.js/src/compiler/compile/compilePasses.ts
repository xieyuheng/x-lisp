import { formatIndent } from "../../helpers/format/formatIndent.ts"
import type { Mod } from "../frontend/mod/index.ts"
import { ShrinkPass } from "../frontend/passes/005-ShrinkPass.ts"
import { UniquifyPass } from "../frontend/passes/010-UniquifyPass.ts"
import { RevealFunctionPass } from "../frontend/passes/011-RevealFunctionPass.ts"
import { LiftLambdaPass } from "../frontend/passes/012-LiftLambdaPass.ts"
import { UnnestOperandPass } from "../frontend/passes/020-UnnestOperandPass.ts"
import { prettyMod } from "../frontend/pretty/index.ts"

export function compilePasses(mod: Mod): void {
  logMod("Initially", mod)
  mod = logMod("ShrinkPass", ShrinkPass(mod))
  mod = logMod("UniquifyPass", UniquifyPass(mod))
  mod = logMod("RevealFunctionPass", RevealFunctionPass(mod))
  mod = logMod("LiftLambdaPass", LiftLambdaPass(mod))
  mod = logMod("UnnestOperandPass", UnnestOperandPass(mod))
}

function logMod(tag: string, mod: Mod): Mod {
  console.log(`${tag}:`)
  console.log(formatIndent(4, "\n" + prettyMod(64, mod)))
  console.log()
  return mod
}
