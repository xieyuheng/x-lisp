import { formatIndent } from "../../helpers/format/formatIndent.ts"
import type { Mod } from "../mod/index.ts"
import { ShrinkPass } from "../passes/005-ShrinkPass.ts"
import { UniquifyPass } from "../passes/010-UniquifyPass.ts"
import { RevealFunctionPass } from "../passes/011-RevealFunctionPass.ts"
import { LiftLambdaPass } from "../passes/012-LiftLambdaPass.ts"
import { UnnestOperandPass } from "../passes/020-UnnestOperandPass.ts"
import { prettyMod } from "../pretty/index.ts"

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
