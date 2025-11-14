import type { Operand } from "../operand/index.ts"

export function formatOperand(operand: Operand): string {
  switch (operand.kind) {
    case "Imm": {
      return `(imm ${operand.value})`
    }

    case "ImmLabel": {
      return `(imm-label ${operand.value})`
    }

    case "Var": {
      return `(var ${operand.name})`
    }

    case "Reg": {
      return `(reg ${operand.name})`
    }

    case "DerefReg": {
      return `(deref-reg (reg ${operand.regName}) ${operand.offset})`
    }

    case "DerefLabel": {
      return `(deref-label ${operand.label})`
    }

    case "Label": {
      return `${operand.name}`
    }

    case "Cc": {
      return `(cc ${operand.code})`
    }

    case "Arity": {
      return `(arity ${operand.value})`
    }
  }
}
