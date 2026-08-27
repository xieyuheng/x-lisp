import { setUnionMany } from "@xieyuheng/std.js/set"
import * as X86 from "../../x86/index.ts"

export type HomeInfo = {
  locations: Map<string, X86.Operand>
}

function newHomeInfo(): HomeInfo {
  return {
    locations: new Map(),
  }
}

export type HomeInfoMap = Map<string, HomeInfo>

export function AllocateRegistersPass(mod: X86.Mod): HomeInfoMap {
  const homeInfoMap = new Map()
  for (const [name, definition] of mod.definitions) {
    if (X86.isCodeDefinition(definition)) {
      const homeInfo = allocateRegisters(definition.instrs)
      homeInfoMap.set(name, homeInfo)
    }
  }

  return homeInfoMap
}

function allocateRegisters(instrs: Array<X86.Instr>): HomeInfo {
  const varNames = Array.from(setUnionMany(instrs.map(instrVarNames)))
  const homeInfo = newHomeInfo()
  for (const [index, varName] of varNames.entries()) {
    homeInfo.locations.set(
      varName,
      X86.RegMemOperand(
        "qword",
        "rbp",
        undefined,
        undefined,
        X86.IntDisplacement(-8 * (index + 1)),
      ),
    )
  }

  return homeInfo
}

function instrVarNames(instr: X86.Instr): Set<string> {
  return setUnionMany(instr.operands.map(operandVarNames))
}

function operandVarNames(operand: X86.Operand): Set<string> {
  switch (operand.kind) {
    case "VarOperand": {
      return new Set([operand.name])
    }

    default: {
      return new Set()
    }
  }
}
