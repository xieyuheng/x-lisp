import * as X86 from "../index.ts"

const SIZE_CHECKED_OPS = new Set([
  "mov",
  "add",
  "sub",
  "cmp",
  "and",
  "or",
  "xor",
  "shl",
  "shr",
  "sar",
  "test",
  "imul",
])

export function CheckPass(program: X86.Program): void {
  checkDuplicateNames(program)
  checkDataFields(program)
  checkInstrSizes(program)
}

function checkDuplicateNames(program: X86.Program): void {
  for (const [name, definition] of program.definitions) {
    if (
      Array.from(program.definitions.keys()).filter((k) => k === name).length >
      1
    ) {
      let message = `[CheckPass] duplicate definition: ${name}`
      throw new Error(message)
    }
  }
}

function checkDataFields(program: X86.Program): void {
  for (const [, definition] of program.definitions) {
    if (definition.kind !== "DataDefinition") continue
    X86.check(
      program,
      definition.value,
      X86.inferDataType(program, definition.value),
    )
  }
}

function checkInstrSizes(program: X86.Program): void {
  for (const definition of program.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    for (const instr of definition.instrs) {
      if (!isSizeCheckedInstr(instr)) continue
      try {
        X86.deriveOpSize(instr)
      } catch (error) {
        let message =
          `[CheckPass] in function ${definition.name}: ` +
          (error instanceof Error ? error.message : String(error))
        throw new Error(message)
      }
    }
  }
}

function isSizeCheckedInstr(instr: X86.Instr): boolean {
  if (!SIZE_CHECKED_OPS.has(instr.op)) return false
  return !instr.operands.some(
    (op) =>
      op.kind === "AddressOperand" ||
      op.kind === "ExternOperand" ||
      op.kind === "FixupOperand" ||
      op.kind === "VarOperand",
  )
}
