import assert from "node:assert"
import * as X86 from "../../../x86/index.ts"
import type { HomeInfo, HomeInfoMap } from "./198-AllocateRegistersPass.ts"

export function AssignHomesPass(
  program: X86.Program,
  homeInfoMap: HomeInfoMap,
): void {
  for (const [name, definition] of program.definitions) {
    if (X86.isCodeDefinition(definition)) {
      const homeInfo = homeInfoMap.get(name)
      assert(homeInfo)
      definition.instrs = definition.instrs.map((instr) =>
        assignHomesInstr(homeInfo, instr),
      )
    }
  }
}

function assignHomesInstr(homeInfo: HomeInfo, instr: X86.Instr): X86.Instr {
  return X86.Instr(
    instr.op,
    instr.operands.map((operand) => assignHomesOperand(homeInfo, operand)),
  )
}

function assignHomesOperand(
  homeInfo: HomeInfo,
  operand: X86.Operand,
): X86.Operand {
  switch (operand.kind) {
    case "VarOperand": {
      const locationOperand = homeInfo.locations.get(operand.name)
      assert(locationOperand)
      return locationOperand
    }

    default: {
      return operand
    }
  }
}
