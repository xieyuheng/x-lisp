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
    case "FloatOperand":
      return operand.value.toString()
    case "LabelOperand":
      return `(label ${operand.name})`
    case "AddressOperand":
      return `(address ${operand.name})`
    case "RipMemOperand": {
      const parts: Array<string> = []
      if (operand.size !== undefined) parts.push(operand.size)
      parts.push(formatOperand(operand.address))
      return `(mem ${parts.join(" ")})`
    }
    case "RegMemOperand": {
      const parts: Array<string> = []
      if (operand.size !== undefined) parts.push(operand.size)
      parts.push(`(reg ${operand.base})`)
      if (operand.index !== undefined) {
        if (operand.scale !== undefined) {
          parts.push(`(* (reg ${operand.index}) ${operand.scale})`)
        } else {
          parts.push(`(reg ${operand.index})`)
        }
      }
      if (operand.disp !== undefined) {
        parts.push(formatDisplacement(operand.disp))
      }
      return `(mem ${parts.join(" ")})`
    }
    case "CcOperand":
      return `(cc ${operand.code})`
    case "VarOperand":
      return `(var ${operand.name})`
    case "ExternOperand":
      return `(extern ${operand.name})`
    case "RelocationOperand": {
      const name = JSON.stringify(operand.name)
      return `(relocation ${operand.type} ${name})`
    }
    case "DataOperand":
      return X86.formatData(operand.data)
  }
}
