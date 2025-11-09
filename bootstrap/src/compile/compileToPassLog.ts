import * as B from "../basic/index.ts"
import { globals } from "../globals.ts"
import * as L from "../lang/index.ts"

export function compileToPassLog(mod: L.Mod): void {
  logLangMod("Input", mod)

  L.ShrinkPass(mod)
  logLangMod("ShrinkPass", mod)

  L.UniquifyPass(mod)
  logLangMod("UniquifyPass", mod)

  L.RevealFunctionPass(mod)
  logLangMod("RevealFunctionPass", mod)

  L.LiftLambdaPass(mod)
  logLangMod("LiftLambdaPass", mod)

  L.UnnestOperandPass(mod)
  logLangMod("UnnestOperandPass", mod)

  const basicMod = B.createMod(mod.url)
  L.ExplicateControlPass(mod, basicMod)
  logBasicMod("ExplicateControlPass", basicMod)
}

function logBasicMod(tag: string, mod: B.Mod): B.Mod {
  console.log(`;;; ${tag}`)
  console.log()
  console.log(B.prettyMod(globals.maxWidth, mod))
  console.log()
  return mod
}

function logLangMod(tag: string, mod: L.Mod): L.Mod {
  console.log(`;;; ${tag}`)
  console.log()
  console.log(L.prettyMod(globals.maxWidth, mod))
  console.log()
  return mod
}
