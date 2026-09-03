import { readI32LE, readU16LE, readU64LE } from "@xieyuheng/std.js/binary"
import {
  PrimitiveFunctionDeclaration,
  PrimitiveVariableDeclaration,
  VariableDeclaration,
  FunctionDefinition,
} from "../definition/Definition.ts"
import { type Exe, type ExeFunctionDefinition, type FunctionFixup } from "../exe/Exe.ts"
import { Instr } from "../instr/Instr.ts"
import {
  FnOperand,
  GlobalOperand,
  IntOperand,
  LabelOperand,
  PrimOperand,
  StringOperand,
  SymbolOperand,
  U16Operand,
  VarOperand,
  FloatOperand,
  type Operand,
} from "../operand/Operand.ts"
import { instructionSize, instructionSpecs, type OperandSpec } from "../assemble/instruction.ts"
import { createProgram, type Program } from "../program/Program.ts"
import { untagFloat, untagInt } from "../value.ts"

export function disassembleExe(exe: Exe): Program {
  const program = createProgram()

  for (const variable of exe.variables) {
    program.definitions.set(variable.name, VariableDeclaration(variable.name))
  }

  for (const primitive of exe.primitiveFunctions) {
    program.definitions.set(
      primitive.name,
      PrimitiveFunctionDeclaration(primitive.name),
    )
  }

  for (const primitive of exe.primitiveVariables) {
    program.definitions.set(
      primitive.name,
      PrimitiveVariableDeclaration(primitive.name),
    )
  }

  for (const fn of exe.functions) {
    program.definitions.set(
      fn.name,
      disassembleFunction(exe, fn),
    )
  }

  return program
}

function disassembleFunction(exe: Exe, fn: ExeFunctionDefinition): FunctionDefinition {
  const parameters = fn.localNames.slice(0, fn.arity)
  const instrs = decodeFunctionInstrs(exe, fn)

  return FunctionDefinition(fn.name, parameters, instrs)
}

function decodeFunctionInstrs(
  exe: Exe,
  fn: ExeFunctionDefinition,
): Array<Instr> {
  const labels = new Map<number, string>()
  for (const label of fn.labels) {
    labels.set(label.offset, label.name)
  }

  const fixups = new Map<number, FunctionFixup>()
  for (const fixup of exe.functionFixupTable.fixups) {
    if (fixup.destName === fn.name) {
      fixups.set(fixup.destOffset, fixup)
    }
  }

  const specsByOpcode = new Map<number, [string, OperandSpec[]]>()
  for (const [op, spec] of instructionSpecs()) {
    specsByOpcode.set(spec.opcode, [op, spec.operands])
  }

  const instrs: Array<Instr> = []
  const code = fn.code
  let offset = 0

  while (offset < code.byteLength) {
    const labelName = labels.get(offset)
    if (labelName !== undefined) {
      instrs.push(Instr("label", [VarOperand(labelName)]))
    }

    const opcode = code[offset]
    const entry = specsByOpcode.get(opcode)
    if (entry === undefined) {
      throw new Error(`[disassembleExe] unknown opcode: ${opcode}`)
    }

    const [op, operands] = entry
    const instr = Instr(op, [])
    const end = offset + instructionSize(instr)
    offset += 1

    const decodedOperands: Array<Operand> = []
    for (const spec of operands) {
      const decoded = decodeOperand(
        code,
        offset,
        end,
        fn,
        spec,
        fixups,
        labels,
      )
      decodedOperands.push(decoded.operand)
      offset = decoded.nextOffset
    }

    instrs.push(Instr(op, decodedOperands))
  }

  return instrs
}

function decodeOperand(
  code: Uint8Array,
  offset: number,
  end: number,
  fn: ExeFunctionDefinition,
  spec: OperandSpec,
  fixups: Map<number, FunctionFixup>,
  labels: Map<number, string>,
): {
  operand: Operand
  nextOffset: number
} {
  switch (spec) {
    case "var": {
      const index = readU16LE(code, offset)
      return {
        operand: VarOperand(fn.localNames[index] ?? `%${index}`),
        nextOffset: offset + 2,
      }
    }

    case "int": {
      return {
        operand: IntOperand(untagInt(readU64LE(code, offset))),
        nextOffset: offset + 8,
      }
    }

    case "float": {
      return {
        operand: FloatOperand(untagFloat(readU64LE(code, offset))),
        nextOffset: offset + 8,
      }
    }

    case "u16": {
      return {
        operand: U16Operand(readU16LE(code, offset)),
        nextOffset: offset + 2,
      }
    }

    case "string": {
      const fixup = fixups.get(offset)
      if (fixup === undefined) {
        throw new Error(`[disassembleExe] missing string fixup at ${offset}`)
      }
      return {
        operand: StringOperand(fixup.name),
        nextOffset: offset + 8,
      }
    }

    case "symbol": {
      const fixup = fixups.get(offset)
      if (fixup === undefined) {
        throw new Error(`[disassembleExe] missing symbol fixup at ${offset}`)
      }
      return {
        operand: SymbolOperand(fixup.name),
        nextOffset: offset + 8,
      }
    }

    case "fn": {
      const fixup = fixups.get(offset)
      if (fixup === undefined) {
        throw new Error(`[disassembleExe] missing fn fixup at ${offset}`)
      }
      return {
        operand: FnOperand(fixup.name),
        nextOffset: offset + 8,
      }
    }

    case "prim": {
      const fixup = fixups.get(offset)
      if (fixup === undefined) {
        throw new Error(`[disassembleExe] missing prim fixup at ${offset}`)
      }
      return {
        operand: PrimOperand(fixup.name),
        nextOffset: offset + 8,
      }
    }

    case "global": {
      const fixup = fixups.get(offset)
      if (fixup === undefined) {
        throw new Error(`[disassembleExe] missing global fixup at ${offset}`)
      }
      return {
        operand: GlobalOperand(fixup.name),
        nextOffset: offset + 8,
      }
    }

    case "label": {
      const relative = readI32LE(code, offset)
      const target = end + relative
      const name = labels.get(target)
      if (name === undefined) {
        throw new Error(`[disassembleExe] label offset not found: ${target}`)
      }
      return {
        operand: LabelOperand(name),
        nextOffset: offset + 4,
      }
    }
  }
}