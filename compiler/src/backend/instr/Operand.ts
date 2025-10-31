import { type Value } from "../value/index.ts"
import type { Meta } from "./Instr.ts"

export type Operand = Var | Imm

export type Var = {
  kind: "Var"
  name: string
  meta?: Meta
}

export function Var(name: string, meta?: Meta): Var {
  return {
    kind: "Var",
    name,
    meta,
  }
}

export type Imm = {
  kind: "Imm"
  value: Value
  meta?: Meta
}

export function Imm(value: Value, meta?: Meta): Imm {
  return {
    kind: "Imm",
    value,
    meta,
  }
}
