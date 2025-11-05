import * as B from "../backend/index.ts"
import * as F from "../frontend/index.ts"

export function compileToBasic(mod: F.Mod): B.Mod {
  F.logMod("Input", mod)
  mod = F.ShrinkPass(mod)
  mod = F.UniquifyPass(mod)
  mod = F.RevealFunctionPass(mod)
  mod = F.LiftLambdaPass(mod)
  mod = F.UnnestOperandPass(mod)
  let basicMod = F.ExplicateControlPass(mod)
  return basicMod
}
