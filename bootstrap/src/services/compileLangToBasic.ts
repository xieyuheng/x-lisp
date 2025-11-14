import * as B from "../basic/index.ts"
import * as L from "../lang/index.ts"

export function compileLangToBasic(mod: L.Mod): B.Mod {
  L.ShrinkPass(mod)
  L.UniquifyPass(mod)
  L.RevealFunctionPass(mod)
  L.LiftLambdaPass(mod)
  L.UnnestOperandPass(mod)

  const basicMod = B.createMod(mod.url)
  B.importBuiltin(basicMod)

  L.ExplicateControlPass(mod, basicMod)

  return basicMod
}
