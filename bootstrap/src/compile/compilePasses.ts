import * as B from "../basic/index.ts"
import * as L from "../lang/index.ts"

export function compilePasses(mod: L.Mod): void {
  L.logMod("Input", mod)

  L.ShrinkPass(mod)
  L.logMod("ShrinkPass", (mod))

  L.UniquifyPass(mod)
  L.logMod("UniquifyPass", mod)

  L.RevealFunctionPass(mod)
  L.logMod("RevealFunctionPass", mod)

  L.LiftLambdaPass(mod)
  L.logMod("LiftLambdaPass", mod)

  L.UnnestOperandPass(mod)
  L.logMod("UnnestOperandPass", mod)

  const basicMod = B.createMod(mod.url)
  L.ExplicateControlPass(mod, basicMod)
  B.logMod("ExplicateControlPass", basicMod)
}
