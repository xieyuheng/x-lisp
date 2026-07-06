export type Operand = VarOperand

export type VarOperand = {
  kind: "VarOperand"
  name: string
}

export function VarOperand(name: string): VarOperand {
  return { kind: "VarOperand", name }
}
