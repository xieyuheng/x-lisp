import * as X86 from "../index.ts"

function formatDisplacement(disp: X86.Displacement): string {
  if (disp.kind === "IntDisplacement") return disp.value.toString()
  return `(offset-of ${[disp.structType, ...disp.fields].join(" ")})`
}

export function formatOperand(operand: X86.Operand): string {
  switch (operand.kind) {
    case "RegOperand":
      return `(reg ${operand.name})`
    case "ImmOperand":
      return operand.value.toString()
    case "LabelOperand":
      return `(label ${operand.name})`
    case "AddressOperand":
      return `(address ${operand.name})`
    case "DerefOperand":
      return `(deref ${formatOperand(operand.address)})`
    case "RegDerefOperand": {
      const parts = [`(reg ${operand.base})`]
      if (operand.index !== undefined) {
        parts.push(`(reg ${operand.index})`)
        parts.push(operand.scale?.toString() || "1")
      }
      if (operand.disp !== undefined) {
        parts.push(formatDisplacement(operand.disp))
      }
      return `(reg-deref ${parts.join(" ")})`
    }
    case "CcOperand":
      return `(cc ${operand.code})`
    case "VarOperand":
      return `(var ${operand.name})`
    case "ExternalLabelOperand":
      return `(external-label ${operand.name})`
    case "DataOperand":
      return X86.formatData(operand.data)
  }
}
