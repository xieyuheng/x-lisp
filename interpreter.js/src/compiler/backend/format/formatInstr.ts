import assert from "node:assert"
import { instrOperands, type Instr } from "../instr/index.ts"
import { formatValue } from "./formatValue.ts"

export function formatInstr(instr: Instr): string {
  switch (instr.op) {
    case "Argument": {
      return `(= ${instr.dest} (argument ${instr.index}))`
    }

    case "Const": {
      return `(= ${instr.dest} (const ${formatValue(instr.value)}))`
    }

    case "Assert": {
      const [x] = instrOperands(instr)
      return `(assert ${x})`
    }

    case "Return": {
      if (instrOperands(instr).length > 0) {
        const [x] = instrOperands(instr)
        return `(return ${x})`
      }

      return `(return)`
    }

    case "Goto": {
      return `(goto ${instr.label})`
    }

    case "Branch": {
      const [conditionx] = instrOperands(instr)
      return `(branch ${conditionx} ${instr.thenLabel} ${instr.elseLabel})`
    }

    case "Call": {
      const operands = instr.operands.join(" ")
      const rhs =
        operands === ""
          ? `(call ${instr.name})`
          : `(call ${instr.name} ${operands})`
      return instr.dest ? `(= ${instr.dest} ${rhs})` : rhs
    }

    case "Apply": {
      assert(instr.operands.length > 0)
      const operands = instr.operands.join(" ")
      const rhs = `(apply ${operands})`
      return instr.dest ? `(= ${instr.dest} ${rhs})` : rhs
    }
  }
}
