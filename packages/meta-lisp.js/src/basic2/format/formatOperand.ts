import * as B from "../index.ts"

export function formatOperand(operand: B.Operand): string {
  switch (operand.kind) {
    case "VarOperand":
      return operand.name
    case "Int64Operand":
      return `(int64 ${operand.value.toString()})`
    case "Float64Operand": {
      const n = operand.value
      if (Number.isInteger(n)) {
        return `(float64 ${n.toString()}.0)`
      }
      return `(float64 ${n.toString()})`
    }
    case "BoolOperand":
      return `(bool ${operand.value ? "true" : "false"})`
    case "VoidOperand":
      return `(void)`
    case "AddressOperand":
      return `(address ${operand.name})`
  }
}

export function formatOperands(operands: Array<B.Operand>): string {
  return operands.map(formatOperand).join(" ")
}
