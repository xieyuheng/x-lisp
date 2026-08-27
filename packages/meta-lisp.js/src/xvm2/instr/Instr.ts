import type { Operand } from "../operand/index.ts"

export type Instr = {
  op: string
  operands: Array<Operand>
}

export function Instr(op: string, operands: Array<Operand>): Instr {
  return {
    op,
    operands,
  }
}
