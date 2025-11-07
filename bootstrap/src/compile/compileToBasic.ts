import * as B from "../basic/index.ts"
import * as F from "../frontend/index.ts"

export function compileToBasic(mod: F.Mod): B.Mod {
  mod = F.ShrinkPass(mod)
  mod = F.UniquifyPass(mod)
  mod = F.RevealFunctionPass(mod)
  mod = F.LiftLambdaPass(mod)
  mod = F.UnnestOperandPass(mod)

  const basicMod = B.createMod(mod.url)
  B.importBuiltin(basicMod)
  F.ExplicateControlPass(mod, basicMod)
  return basicMod
}
