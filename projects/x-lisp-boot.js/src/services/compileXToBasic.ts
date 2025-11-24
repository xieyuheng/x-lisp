import * as B from "@xieyuheng/basic-lisp.js"
import * as X from "../index.ts"

export function compileXToBasic(xMod: X.Mod): B.Mod {
  X.ShrinkPass(xMod)
  X.UniquifyPass(xMod)
  X.RevealFunctionPass(xMod)
  X.LiftLambdaPass(xMod)
  X.UnnestOperandPass(xMod)
  const basicMod = B.createMod(xMod.url, new Map())
  B.importBuiltin(basicMod)
  X.ExplicateControlPass(xMod, basicMod)
  return basicMod
}
