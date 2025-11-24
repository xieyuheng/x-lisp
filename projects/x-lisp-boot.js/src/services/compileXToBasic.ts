import * as B from "@xieyuheng/basic-lisp.js"
import * as X from "../index.ts"

export function compileXToBasic(mod: X.Mod): B.Mod {
  X.ShrinkPass(mod)
  X.UniquifyPass(mod)
  X.RevealFunctionPass(mod)
  X.LiftLambdaPass(mod)
  X.UnnestOperandPass(mod)
  const basicMod = B.createMod(mod.url, new Map())
  B.importBuiltin(basicMod)
  X.ExplicateControlPass(mod, basicMod)
  return basicMod
}
