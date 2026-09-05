import {
  writeI32LE,
  writeU16LE,
  writeU64LE,
  writeU8LE,
} from "@xieyuheng/std.js/binary"
import { type Exe } from "../exe/Exe.ts"
import {
  type FixupType,
  type FunctionFixup,
} from "../exe/FunctionFixupTable.ts"
import { nameTableAddName } from "../exe/NameTable.ts"
import { type Instr } from "../instr/Instr.ts"
import {
  asFloatOperand,
  asFnOperand,
  asGlobalOperand,
  asIntOperand,
  asLabelOperand,
  asPrimOperand,
  asStringOperand,
  asSymbolOperand,
  asVarOperand,
  isU16Operand,
  type Operand,
} from "../operand/Operand.ts"
import { tagFloat, tagInt } from "../value.ts"
import {
  lookupLabelOffset,
  lookupLocalIndex,
  type AssembleContext,
} from "./AssembleContext.ts"
import {
  instructionSize,
  instructionSpec,
  opcodeFor,
  type OperandSpec,
} from "./instruction.ts"

export function assembleInstr(
  exe: Exe,
  ctx: AssembleContext,
  instr: Instr,
): void {
  if (instr.op === "label") {
    return
  }

  const spec = instructionSpec(instr.op)
  if (spec.operands.length !== instr.operands.length) {
    throw new Error(
      `[assembleInstr] operand count mismatch: ${instr.op} ` +
        `spec=${spec.operands.length} actual=${instr.operands.length}`,
    )
  }

  const start = ctx.offset
  ctx.offset = writeU8LE(ctx.code, ctx.offset, opcodeFor(instr.op))

  for (let i = 0; i < spec.operands.length; i++) {
    assembleOperand(exe, ctx, start, instr, spec.operands[i], instr.operands[i])
  }
}

function assembleOperand(
  exe: Exe,
  ctx: AssembleContext,
  start: number,
  instr: Instr,
  spec: OperandSpec,
  operand: Operand,
): void {
  switch (spec) {
    case "var": {
      ctx.offset = writeU16LE(
        ctx.code,
        ctx.offset,
        lookupLocalIndex(ctx.localIndexMap, asVarOperand(operand).name),
      )
      return
    }

    case "int": {
      ctx.offset = writeU64LE(
        ctx.code,
        ctx.offset,
        tagInt(asIntOperand(operand).content),
      )
      return
    }

    case "float": {
      ctx.offset = writeU64LE(
        ctx.code,
        ctx.offset,
        tagFloat(asFloatOperand(operand).content),
      )
      return
    }

    case "u16": {
      if (isU16Operand(operand)) {
        ctx.offset = writeU16LE(ctx.code, ctx.offset, operand.content)
      } else {
        const intOperand = asIntOperand(operand)
        ctx.offset = writeU16LE(
          ctx.code,
          ctx.offset,
          Number(intOperand.content),
        )
      }
      return
    }

    case "string": {
      addFixup(
        exe,
        ctx,
        "string-value",
        asStringOperand(operand).content,
        ctx.offset,
      )
      ctx.offset += 8
      return
    }

    case "symbol": {
      addFixup(
        exe,
        ctx,
        "symbol-value",
        asSymbolOperand(operand).content,
        ctx.offset,
      )
      ctx.offset += 8
      return
    }

    case "fn": {
      addFixup(exe, ctx, "fn-pointer", asFnOperand(operand).name, ctx.offset)
      ctx.offset += 8
      return
    }

    case "prim": {
      addFixup(
        exe,
        ctx,
        "prim-pointer",
        asPrimOperand(operand).name,
        ctx.offset,
      )
      ctx.offset += 8
      return
    }

    case "global": {
      addFixup(
        exe,
        ctx,
        "global-pointer",
        asGlobalOperand(operand).name,
        ctx.offset,
      )
      ctx.offset += 8
      return
    }

    case "label": {
      const end = start + instructionSize(instr)
      ctx.offset = writeI32LE(
        ctx.code,
        ctx.offset,
        lookupLabelOffset(ctx.labelOffsetMap, asLabelOperand(operand).name) -
          end,
      )
      return
    }
  }
}

function addFixup(
  exe: Exe,
  ctx: AssembleContext,
  type: FixupType,
  name: string,
  destOffset: number,
): void {
  nameTableAddName(exe.nameTable, type)
  nameTableAddName(exe.nameTable, name)
  nameTableAddName(exe.nameTable, ctx.functionName)

  const fixup: FunctionFixup = {
    type,
    name,
    destName: ctx.functionName,
    destOffset,
  }

  exe.functionFixupTable.fixups.push(fixup)
}
