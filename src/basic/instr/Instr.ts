import { type Type } from "../type/index.ts"
import { type Operand } from "./Operand.ts"

export type Instr = {
  dest?: string
  type?: Type
  op: string
  operands: Array<Operand>
}

export type Operation = Instr & {
  dest: string
}

export function isOperation(instr: Instr): instr is Operation {
  return instr.dest !== undefined
}

export type Effect = Instr & {
  dest: undefined
}

export function isEffect(instr: Instr): instr is Effect {
  return instr.dest === undefined
}
