import * as B from "../backend/index.ts"
import * as F from "../frontend/index.ts"

export function compilePasses(mod: F.Mod): void {
  F.logMod("Input", mod)
  mod = F.logMod("ShrinkPass", F.ShrinkPass(mod))
  mod = F.logMod("UniquifyPass", F.UniquifyPass(mod))
  mod = F.logMod("RevealFunctionPass", F.RevealFunctionPass(mod))
  mod = F.logMod("LiftLambdaPass", F.LiftLambdaPass(mod))
  mod = F.logMod("UnnestOperandPass", F.UnnestOperandPass(mod))
  const basicMod = B.logMod("ExplicateControlPass", F.ExplicateControlPass(mod))
}
