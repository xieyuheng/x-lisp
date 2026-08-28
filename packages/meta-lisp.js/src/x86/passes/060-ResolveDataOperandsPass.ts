import * as X86 from "../index.ts"

let anonCounter = 0

export function ResolveDataOperandsPass(program: X86.Program): void {
  for (const definition of program.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    for (let i = 0; i < definition.instrs.length; i++) {
      const instr = definition.instrs[i]
      const newOperands = instr.operands.map((op) =>
        resolveDataOperand(program, op),
      )
      definition.instrs[i] = X86.Instr(instr.op, newOperands)
    }
  }
}

function resolveDataOperand(
  program: X86.Program,
  op: X86.Operand,
): X86.Operand {
  if (op.kind !== "DataOperand") return op

  const data = op.data

  if (data.kind === "IntData") {
    return X86.ImmOperand(data.content)
  }

  if (data.kind === "StringData") {
    const anonName = `©data.${anonCounter++}`
    program.definitions.set(
      anonName,
      X86.DataDefinition(anonName, X86.PointerData(data)),
    )
    return X86.RipMemOperand("qword", X86.AddressOperand(anonName))
  }

  if (data.kind === "PointerData") {
    const anonName = `©data.${anonCounter++}`
    program.definitions.set(anonName, X86.DataDefinition(anonName, data))
    return X86.RipMemOperand("qword", X86.AddressOperand(anonName))
  }
  if (data.kind === "StructData") {
    let message = `bare struct in operand is not supported; use (pointer (struct ...)) or (address name)`
    throw new Error(message)
  }

  if (data.kind === "ArrayData") {
    let message = `bare array in operand is not supported; use (pointer (array ...)) or (address name)`
    throw new Error(message)
  }

  let message = `unexpected value kind in data operand`
  throw new Error(message)
}
