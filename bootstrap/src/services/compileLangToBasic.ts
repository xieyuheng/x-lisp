import * as B from "../basic/index.ts"
import * as L from "../lang/index.ts"

export function compileLangToBasic(langMod: L.Mod): B.Mod {
  L.ShrinkPass(langMod)
  L.UniquifyPass(langMod)
  L.RevealFunctionPass(langMod)
  L.LiftLambdaPass(langMod)
  L.UnnestOperandPass(langMod)
  const basicMod = B.createMod(langMod.url)
  B.importBuiltin(basicMod)
  L.ExplicateControlPass(langMod, basicMod)
  return basicMod
}
