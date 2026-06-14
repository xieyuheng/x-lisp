import * as X86 from "../index.ts"

export function formatOperand(operand: X86.Operand): string {
  switch (operand.kind) {
    case "RegOperand":
      return `(reg ${operand.name})`
    case "ImmOperand":
      return `(imm ${operand.value})`
    case "LabelOperand":
      if (operand.path.length === 0) {
        return `(label ${operand.name})`
      }
      return `(label ${[operand.name, ...operand.path].join(" ")})`
    case "LabelImmOperand":
      return `(label-imm ${formatOperand(operand.label)})`
    case "LabelDerefOperand":
      return `(label-deref ${formatOperand(operand.label)})`
    case "RegDerefOperand": {
      const parts = [`(reg ${operand.base})`]
      if (operand.index !== undefined) {
        parts.push(`(reg ${operand.index})`)
        parts.push(operand.scale?.toString() || "1")
      }
      if (operand.disp !== undefined) {
        parts.push(operand.disp.toString())
      }
      return `(reg-deref ${parts.join(" ")})`
    }
    case "CcOperand":
      return `(cc ${operand.code})`
    case "VarOperand":
      return `(var ${operand.name})`
    case "ExternalLabelOperand":
      return `(external-label ${operand.name})`
  }
}
