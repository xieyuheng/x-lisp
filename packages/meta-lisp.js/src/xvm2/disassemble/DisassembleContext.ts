import { type FunctionFixup, type Exe, type ExeFunctionDefinition } from "../exe/Exe.ts"
import { type OperandSpec } from "../assemble/instruction.ts"
import { instructionSpecs } from "../assemble/instruction.ts"

export type DisassembleContext = {
  functionName: string
  localNames: Array<string>
  labelNameByOffset: Map<number, string>
  fixupByOffset: Map<number, FunctionFixup>
  specsByOpcode: Map<number, [string, Array<OperandSpec>]>
  code: Uint8Array
  offset: number
}

export function makeDisassembleContext(
  exe: Exe,
  fn: ExeFunctionDefinition,
): DisassembleContext {
  const labelNameByOffset = new Map<number, string>()
  for (const label of fn.labels) {
    labelNameByOffset.set(label.offset, label.name)
  }

  const fixupByOffset = new Map<number, FunctionFixup>()
  for (const fixup of exe.functionFixupTable.fixups) {
    if (fixup.destName === fn.name) {
      fixupByOffset.set(fixup.destOffset, fixup)
    }
  }

  const specsByOpcode = new Map<number, [string, Array<OperandSpec>]>()
  for (const [op, spec] of instructionSpecs()) {
    specsByOpcode.set(spec.opcode, [op, spec.operands])
  }

  return {
    functionName: fn.name,
    localNames: fn.localNames,
    labelNameByOffset,
    fixupByOffset,
    specsByOpcode,
    code: fn.code,
    offset: 0,
  }
}