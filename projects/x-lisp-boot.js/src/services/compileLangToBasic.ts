import * as B from "@xieyuheng/basic-lisp.js"
import * as L from "../lang/index.ts"

export function compileLangToBasic(langMod: L.Mod): B.Mod {
  L.ShrinkPass(langMod)
  L.UniquifyPass(langMod)
  L.RevealFunctionPass(langMod)
  L.LiftLambdaPass(langMod)
  L.UnnestOperandPass(langMod)
  const basicMod = B.createMod(langMod.url, new Map())
  B.importBuiltin(basicMod)
  L.ExplicateControlPass(langMod, basicMod)
  return basicMod
}
