import { type SourceLocation } from "@xieyuheng/sexp.js"
import type { Operand } from "../operand/index.ts"

export type Instr = {
  op: string
  operands: Array<Operand>
  location?: SourceLocation
}

export function Instr(
  op: string,
  operands: Array<Operand>,
  location?: SourceLocation,
): Instr {
  return {
    op,
    operands,
    location,
  }
}
