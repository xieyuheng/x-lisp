import * as B from "@xieyuheng/basic-lisp.js"
import * as X from "../lang/index.ts"

export function compileLangToBasic(langMod: X.Mod): B.Mod {
  X.ShrinkPass(langMod)
  X.UniquifyPass(langMod)
  X.RevealFunctionPass(langMod)
  X.LiftLambdaPass(langMod)
  X.UnnestOperandPass(langMod)
  const basicMod = B.createMod(langMod.url, new Map())
  B.importBuiltin(basicMod)
  X.ExplicateControlPass(langMod, basicMod)
  return basicMod
}
