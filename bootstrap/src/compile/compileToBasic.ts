import * as B from "../basic/index.ts"
import * as L from "../lang/index.ts"

export function compileToBasic(mod: L.Mod): B.Mod {
  mod = L.ShrinkPass(mod)
  mod = L.UniquifyPass(mod)
  mod = L.RevealFunctionPass(mod)
  mod = L.LiftLambdaPass(mod)
  mod = L.UnnestOperandPass(mod)

  const basicMod = B.createMod(mod.url)
  B.importBuiltin(basicMod)
  L.ExplicateControlPass(mod, basicMod)
  return basicMod
}
