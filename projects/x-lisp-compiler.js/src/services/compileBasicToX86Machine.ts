import * as B from "../basic/index.ts"
import * as M from "../machine/index.ts"
import * as Passes from "../passes/index.ts"

export function compileBasicToX86Machine(basicMod: B.Mod): M.Mod {
  const machineMod = M.createMod(basicMod.url)
  Passes.SelectInstructionPass(basicMod, machineMod)
  Passes.SetupVariableInfo(machineMod)
  Passes.AssignHomePass(machineMod)
  Passes.PatchInstructionPass(machineMod)
  Passes.PrologAndEpilogPass(machineMod)
  return machineMod
}
