export type Operand =
  | VarOperand
  | Int64Operand
  | Float64Operand
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

export type Int64Operand = {
  kind: "Int64Operand"
  value: bigint
}

export function Int64Operand(value: bigint): Int64Operand {
  return { kind: "Int64Operand", value }
}

export type Float64Operand = {
  kind: "Float64Operand"
  value: number
}

export function Float64Operand(value: number): Float64Operand {
  return { kind: "Float64Operand", value }
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
