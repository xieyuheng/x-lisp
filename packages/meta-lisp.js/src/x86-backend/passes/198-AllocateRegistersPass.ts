import * as X86 from "@xieyuheng/x86-lisp.js"

export type HomeInfo = {
  locations: Map<string, X86.Operand>
}

function newHomeInfo(): HomeInfo {
  return {
    locations: new Map(),
  }
}

export type HomeInfoMap = Map<string, HomeInfo>

export function AllocateRegistersPass(program: X86.Program): HomeInfoMap {
  const homeInfoMap = new Map()
  for (const [name, definition] of program.definitions) {
    if (X86.isCodeDefinition(definition)) {
      const homeInfo = allocateRegisters(definition.instrs)
      homeInfoMap.set(name, homeInfo)
    }
  }

  return homeInfoMap
}

function allocateRegisters(instrs: Array<X86.Instr>): HomeInfo {
  const varNames = new Set<string>()

  for (const instr of instrs) {
    for (const operand of instr.operands) {
      if (operand.kind === "VarOperand") {
        varNames.add(operand.name)
      }
    }
  }

  const homeInfo = newHomeInfo()
  let index = 0
  for (const varName of varNames) {
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
    index++
  }

  return homeInfo
}
