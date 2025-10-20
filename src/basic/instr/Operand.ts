import { type Value } from "../value/index.ts"

export type Operand = Var

export type Var = {
  kind: "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    kind: "Var",
    name,
  }
}

export type Imm = {
  kind: "Imm"
  value: Value
}

export function Imm(value: Value): Imm {
  return {
    kind: "Imm",
    value,
  }
}
