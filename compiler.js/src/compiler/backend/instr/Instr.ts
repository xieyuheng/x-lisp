import { type TokenMeta } from "@xieyuheng/x-sexp.js"
import { type Operand } from "./Operand.ts"

export type Meta = TokenMeta

export type Instr = {
  dest?: string
  op: string
  operands: Array<Operand>
  meta?: Meta
}
