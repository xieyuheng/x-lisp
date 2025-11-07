import * as B from "../basic/index.ts"
import * as L from "../lang/index.ts"

export function compilePasses(mod: L.Mod): void {
  L.logMod("Input", mod)
  mod = L.logMod("ShrinkPass", L.ShrinkPass(mod))
  mod = L.logMod("UniquifyPass", L.UniquifyPass(mod))
  mod = L.logMod("RevealFunctionPass", L.RevealFunctionPass(mod))
  mod = L.logMod("LiftLambdaPass", L.LiftLambdaPass(mod))
  mod = L.logMod("UnnestOperandPass", L.UnnestOperandPass(mod))

  const basicMod = B.createMod(mod.url)
  L.ExplicateControlPass(mod, basicMod)
  B.logMod("ExplicateControlPass", basicMod)
}
