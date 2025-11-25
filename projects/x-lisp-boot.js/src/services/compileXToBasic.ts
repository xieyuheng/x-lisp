import * as B from "@xieyuheng/basic-lisp.js"
import * as X from "../index.ts"
import * as Passes from "../passes/index.ts"

export function compileXToBasic(mod: X.Mod): B.Mod {
  Passes.ShrinkPass(mod)
  Passes.UniquifyPass(mod)
  Passes.RevealFunctionPass(mod)
  Passes.LiftLambdaPass(mod)
  Passes.UnnestOperandPass(mod)
  const basicMod = B.createMod(mod.url, new Map())
  B.importBuiltin(basicMod)
  Passes.ExplicateControlPass(mod, basicMod)
  return basicMod
}
