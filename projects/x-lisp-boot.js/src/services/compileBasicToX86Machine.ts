import * as B from "@xieyuheng/basic-lisp.js"
import * as M from "@xieyuheng/machine-lisp.js"

export function compileBasicToX86Machine(basicMod: B.Mod): M.Mod {
  const machineMod = M.createMod(basicMod.url)
  B.SelectInstructionPass(basicMod, machineMod)
  M.AssignHomePass(machineMod)
  M.PatchInstructionPass(machineMod)
  M.PrologAndEpilogPass(machineMod)
  return machineMod
}
