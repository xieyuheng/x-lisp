import * as X86 from "../index.ts"

export function formatOperand(operand: X86.Operand): string {
  switch (operand.kind) {
    case "RegOperand":
      return `(reg ${operand.name})`
    case "ImmOperand":
      return `(imm ${operand.value})`
    case "LabelOperand":
      return `(label ${operand.name})`
    case "AddressOperand":
      return `(address ${[operand.name, ...operand.path].join(" ")})`
    case "DerefOperand":
      return `(deref ${formatOperand(operand.address)})`
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
