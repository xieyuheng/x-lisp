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

export function CheckPass(mod: X86.Mod): void {
  checkDuplicateNames(mod)
  checkDataFields(mod)
  checkInstrSizes(mod)
}

function checkDuplicateNames(mod: X86.Mod): void {
  for (const [name, definition] of mod.definitions) {
    if (
      Array.from(mod.definitions.keys()).filter((k) => k === name).length > 1
    ) {
      let message = `[CheckPass] duplicate definition: ${name}`
      throw new Error(message)
    }
  }
}

function checkDataFields(mod: X86.Mod): void {
  for (const [, definition] of mod.definitions) {
    if (definition.kind !== "DataDefinition") continue
    X86.check(mod, definition.value, X86.inferDataType(mod, definition.value))
  }
}

function checkInstrSizes(mod: X86.Mod): void {
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    for (const block of definition.blocks) {
      for (const instr of block.instrs) {
        if (!isSizeCheckedInstr(instr)) continue
        try {
          X86.deriveOpSize(instr)
        } catch (error) {
          let message =
            `[CheckPass] in block ${block.label}: ` +
            (error instanceof Error ? error.message : String(error))
          throw new Error(message)
        }
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
      op.kind === "RelocationOperand" ||
      op.kind === "VarOperand",
  )
}
