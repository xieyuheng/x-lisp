import * as B from "../basic/index.ts"
import * as M from "../machine/index.ts"

export function compileBasicToX86Machine(basicMod: B.Mod): M.Mod {
  const machineMod = M.createMod(basicMod.url)
  M.externBuiltin(machineMod)
  B.SelectInstructionPass(basicMod, machineMod)
  return machineMod
}
