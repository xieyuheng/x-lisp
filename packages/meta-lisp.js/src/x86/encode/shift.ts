import type { Instr } from "../instr/index.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

const EXT: Record<string, number> = {
  shl: 4,
  shr: 5,
}

export function encodeShift(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]
  const ext = EXT[instr.op]
  if (ext === undefined) throw new Error(`unknown shift op: ${instr.op}`)

  if (dst.kind !== "RegOperand") {
    throw new Error(`[${instr.op}] dst must be register, got: ${dst.kind}`)
  }

  if (src.kind === "RegOperand" && src.name === "rcx") {
    return [encodeShiftCl(dst.name, ext)]
  }

  if (src.kind === "ImmOperand") {
    return [encodeShiftImm(dst.name, src.value, ext)]
  }

  throw new Error(`[${instr.op}] unsupported src operand: ${src.kind}`)
}

function encodeShiftCl(dstReg: string, ext: number): EncodedInstruction {
  return {
    prefixes: [],
    rex: computeRex(true, null, null, dstReg),
    opcode: [0xd3],
    modRM: modRM(MOD_REG, ext, regCode(dstReg)),
    sib: null,
    displacement: null,
    immediate: null,
  }
}

function encodeShiftImm(
  dstReg: string,
  value: bigint,
  ext: number,
): EncodedInstruction {
  if (value === 1n) {
    return {
      prefixes: [],
      rex: computeRex(true, null, null, dstReg),
      opcode: [0xd1],
      modRM: modRM(MOD_REG, ext, regCode(dstReg)),
      sib: null,
      displacement: null,
      immediate: null,
    }
  }
  return {
    prefixes: [],
    rex: computeRex(true, null, null, dstReg),
    opcode: [0xc1],
    modRM: modRM(MOD_REG, ext, regCode(dstReg)),
    sib: null,
    displacement: null,
    immediate: { size: 1, value },
  }
}
