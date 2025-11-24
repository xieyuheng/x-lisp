import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Operand } from "../operand/index.ts"

export type Instr = {
  op: string
  operands: Array<Operand>
  meta?: Meta
}

export function Instr(
  op: string,
  operands: Array<Operand>,
  meta?: Meta,
): Instr {
  return {
    op,
    operands,
    meta,
  }
}
