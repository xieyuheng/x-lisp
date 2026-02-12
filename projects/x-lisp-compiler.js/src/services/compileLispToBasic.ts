import * as B from "../basic/index.ts"
import * as L from "../lisp/index.ts"
import * as Passes from "../passes/index.ts"

export function compileLispToBasic(mod: L.Mod): B.Mod {
  Passes.ShrinkPass(mod)
  Passes.UniquifyPass(mod)
  Passes.RevealGlobalPass(mod)
  Passes.LiftLambdaPass(mod)
  Passes.UnnestOperandPass(mod)
  const basicMod = B.createMod(mod.url, new Map())
  Passes.ExplicateControlPass(mod, basicMod)
  return basicMod
}
