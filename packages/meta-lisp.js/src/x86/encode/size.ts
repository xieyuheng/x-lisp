import type { Instr } from "../instr/index.ts"
import type { Operand } from "../operand/index.ts"
import { sizeToBytes } from "../operand/index.ts"
import { regSize } from "./reg.ts"

export function operandSize(op: Operand): 1 | 2 | 4 | 8 | undefined {
  switch (op.kind) {
    case "RegOperand":
      return regSize(op.name)
    case "DerefOperand":
    case "RegDerefOperand":
      return op.size === undefined ? undefined : sizeToBytes(op.size)
    default:
      return undefined
  }
}

export function deriveOpSize(instr: Instr): 1 | 2 | 4 | 8 {
  const sizes = instr.operands
    .map(operandSize)
    .filter((s): s is 1 | 2 | 4 | 8 => s !== undefined)

  if (sizes.length === 0) {
    let message =
      `[deriveOpSize] cannot infer operand size for ${instr.op}; ` +
      `annotate a deref with a size, e.g. (deref byte (address ...))`
    throw new Error(message)
  }

  const size = sizes[0]
  for (const s of sizes) {
    if (s !== size) {
      let message =
        `[deriveOpSize] operand size mismatch in ${instr.op}: ` +
        `${s} vs ${size}`
      throw new Error(message)
    }
  }

  return size
}

export function sizePrefix(size: 1 | 2 | 4 | 8): Array<number> {
  return size === 2 ? [0x66] : []
}

export function checkImm8(value: bigint): void {
  if (value < -128n || value > 255n) {
    let message = `[checkImm8] immediate ${value} does not fit in an 8-bit operand`
    throw new Error(message)
  }
}
