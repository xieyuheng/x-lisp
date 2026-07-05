export type Operand =
  | VarOperand
  | IntOperand
  | FloatOperand
  | BoolOperand
  | VoidOperand
  | AddressOperand

export type VarOperand = {
  kind: "VarOperand"
  name: string
}

export function VarOperand(name: string): VarOperand {
  return { kind: "VarOperand", name }
}

export type IntOperand = {
  kind: "IntOperand"
  value: bigint
}

export function IntOperand(value: bigint): IntOperand {
  return { kind: "IntOperand", value }
}

export type FloatOperand = {
  kind: "FloatOperand"
  value: number
}

export function FloatOperand(value: number): FloatOperand {
  return { kind: "FloatOperand", value }
}

export type BoolOperand = {
  kind: "BoolOperand"
  value: boolean
}

export function BoolOperand(value: boolean): BoolOperand {
  return { kind: "BoolOperand", value }
}

export type VoidOperand = {
  kind: "VoidOperand"
}

export function VoidOperand(): VoidOperand {
  return { kind: "VoidOperand" }
}

export type AddressOperand = {
  kind: "AddressOperand"
  name: string
}

export function AddressOperand(name: string): AddressOperand {
  return { kind: "AddressOperand", name }
}
