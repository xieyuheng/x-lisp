import * as X86 from "../../x86/index.ts"

export type HomeInfo = {
  locations: Map<string, X86.Operand>
}

function newHomeInfo(): HomeInfo {
  return {
    locations: new Map()
  }
}

export type HomeInfoMap = Map<string, HomeInfo>

export function AllocateRegistersPass(mod: X86.Mod): HomeInfoMap {
  const homeInfoMap = new Map()

  return homeInfoMap
}

function allocateRegisters(instrs: Array<X86.Instr>): HomeInfo {
  const homeInfo = newHomeInfo()
  return homeInfo
}
