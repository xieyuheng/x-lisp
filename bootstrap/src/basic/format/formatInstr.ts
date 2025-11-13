import assert from "node:assert"
import { type Instr } from "../instr/index.ts"
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
      return `(assert ${instr.condition})`
    }

    case "Return": {
      if ((instr.result) !== undefined) {
        return `(return ${instr.result})`
      }

      return `(return)`
    }

    case "Goto": {
      return `(goto ${instr.label})`
    }

    case "Branch": {
      return `(branch ${instr.condition} ${instr.thenLabel} ${instr.elseLabel})`
    }

    case "Call": {
      const args = instr.args.join(" ")
      const rhs =
        args === ""
          ? `(call ${instr.name})`
          : `(call ${instr.name} ${args})`
      return instr.dest ? `(= ${instr.dest} ${rhs})` : rhs
    }

    case "Apply": {
      const rhs = `(apply ${instr.target} ${instr.arg})`
      return instr.dest ? `(= ${instr.dest} ${rhs})` : rhs
    }

    case "NullaryApply": {
      const rhs = `(nullary-apply ${instr.target})`
      return instr.dest ? `(= ${instr.dest} ${rhs})` : rhs
    }
  }
}
