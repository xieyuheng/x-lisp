import { type Type } from "../type/index.ts"
import { type Operand } from "./Operand.ts"

export type Instr = {
  dest?: string
  type?: Type
  op: string
  operands: Array<Operand>
}
