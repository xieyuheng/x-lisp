import * as F from "../forth/index.ts"
import * as L from "../lisp/index.ts"
import * as Passes from "../passes/index.ts"

export function compileLispToForth(mod: L.Mod): F.Mod {
  Passes.ShrinkPass(mod)
  Passes.UniquifyPass(mod)
  Passes.RevealGlobalPass(mod)
  Passes.LiftLambdaPass(mod)
  const forthMod = F.createMod(mod.url, new Map())
  Passes.ExplicateControlPass(mod, forthMod)
  return forthMod
}
