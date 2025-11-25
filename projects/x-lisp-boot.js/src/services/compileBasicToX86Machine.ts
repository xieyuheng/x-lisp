import * as B from "@xieyuheng/basic-lisp.js"
import * as M from "@xieyuheng/machine-lisp.js"
import * as Passes from "../passes/index.ts"

export function compileBasicToX86Machine(basicMod: B.Mod): M.Mod {
  const machineMod = M.createMod(basicMod.url)
  Passes.SelectInstructionPass(basicMod, machineMod)
  M.AssignHomePass(machineMod)
  M.PatchInstructionPass(machineMod)
  M.PrologAndEpilogPass(machineMod)
  return machineMod
}
