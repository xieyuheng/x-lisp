import { readI32LE, readU16LE, readU64LE } from "@xieyuheng/std.js/binary"
import { FunctionDefinition } from "../definition/Definition.ts"
import { type Exe, type ExeFunctionDefinition } from "../exe/Exe.ts"
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
import { instructionSize, type OperandSpec } from "../assemble/instruction.ts"
import { untagFloat, untagInt } from "../value.ts"
import {
  makeDisassembleContext,
  type DisassembleContext,
} from "./DisassembleContext.ts"

export function disassembleFunction(
  exe: Exe,
  fn: ExeFunctionDefinition,
): FunctionDefinition {
  const ctx = makeDisassembleContext(exe, fn)
  const parameters = fn.localNames.slice(0, fn.arity)
  const instrs = decodeFunctionInstrs(ctx)

  return FunctionDefinition(fn.name, parameters, instrs)
}

function decodeFunctionInstrs(ctx: DisassembleContext): Array<Instr> {
  const instrs: Array<Instr> = []
  const code = ctx.code

  while (ctx.offset < code.byteLength) {
    const labelName = ctx.labelNameByOffset.get(ctx.offset)
    if (labelName !== undefined) {
      instrs.push(Instr("label", [VarOperand(labelName)]))
    }

    const opcode = code[ctx.offset]
    const entry = ctx.specsByOpcode.get(opcode)
    if (entry === undefined) {
      throw new Error(`[disassembleFunction] unknown opcode: ${opcode}`)
    }

    const [op, operands] = entry
    const instr = Instr(op, [])
    const end = ctx.offset + instructionSize(instr)
    ctx.offset += 1

    const decodedOperands: Array<Operand> = []
    for (const spec of operands) {
      const decoded = decodeOperand(ctx, end, spec)
      decodedOperands.push(decoded.operand)
      ctx.offset = decoded.nextOffset
    }

    instrs.push(Instr(op, decodedOperands))
  }

  return instrs
}

function decodeOperand(
  ctx: DisassembleContext,
  end: number,
  spec: OperandSpec,
): {
  operand: Operand
  nextOffset: number
} {
  const code = ctx.code
  const offset = ctx.offset

  switch (spec) {
    case "var": {
      const index = readU16LE(code, offset)
      return {
        operand: VarOperand(ctx.localNames[index] ?? `%${index}`),
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
      const fixup = ctx.fixupByOffset.get(offset)
      if (fixup === undefined) {
        throw new Error(`[disassembleFunction] missing string fixup at ${offset}`)
      }
      return {
        operand: StringOperand(fixup.name),
        nextOffset: offset + 8,
      }
    }

    case "symbol": {
      const fixup = ctx.fixupByOffset.get(offset)
      if (fixup === undefined) {
        throw new Error(`[disassembleFunction] missing symbol fixup at ${offset}`)
      }
      return {
        operand: SymbolOperand(fixup.name),
        nextOffset: offset + 8,
      }
    }

    case "fn": {
      const fixup = ctx.fixupByOffset.get(offset)
      if (fixup === undefined) {
        throw new Error(`[disassembleFunction] missing fn fixup at ${offset}`)
      }
      return {
        operand: FnOperand(fixup.name),
        nextOffset: offset + 8,
      }
    }

    case "prim": {
      const fixup = ctx.fixupByOffset.get(offset)
      if (fixup === undefined) {
        throw new Error(`[disassembleFunction] missing prim fixup at ${offset}`)
      }
      return {
        operand: PrimOperand(fixup.name),
        nextOffset: offset + 8,
      }
    }

    case "global": {
      const fixup = ctx.fixupByOffset.get(offset)
      if (fixup === undefined) {
        throw new Error(`[disassembleFunction] missing global fixup at ${offset}`)
      }
      return {
        operand: GlobalOperand(fixup.name),
        nextOffset: offset + 8,
      }
    }

    case "label": {
      const relative = readI32LE(code, offset)
      const target = end + relative
      const name = ctx.labelNameByOffset.get(target)
      if (name === undefined) {
        throw new Error(`[disassembleFunction] label offset not found: ${target}`)
      }
      return {
        operand: LabelOperand(name),
        nextOffset: offset + 4,
      }
    }
  }
}
