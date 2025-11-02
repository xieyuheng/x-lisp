import { formatIndent } from "../../helpers/format/formatIndent.ts"
import * as F from "../frontend/index.ts"

export function compilePasses(mod: F.Mod): void {
  logFrontendMod("Initially", mod)
  mod = logFrontendMod("ShrinkPass", F.ShrinkPass(mod))
  mod = logFrontendMod("UniquifyPass", F.UniquifyPass(mod))
  mod = logFrontendMod("RevealFunctionPass", F.RevealFunctionPass(mod))
  mod = logFrontendMod("LiftLambdaPass", F.LiftLambdaPass(mod))
  mod = logFrontendMod("UnnestOperandPass", F.UnnestOperandPass(mod))
}

function logFrontendMod(tag: string, mod: F.Mod): F.Mod {
  console.log(`${tag}:`)
  console.log(formatIndent(4, "\n" + F.prettyMod(64, mod)))
  console.log()
  return mod
}
