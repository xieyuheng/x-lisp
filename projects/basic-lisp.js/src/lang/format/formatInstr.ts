import { type Instr } from "../instr/index.ts"
import { formatValue } from "./formatValue.ts"

export function formatInstr(instr: Instr): string {
  switch (instr.op) {
    case "Argument": {
      return `(= ${instr.dest} (argument ${instr.index}))`
    }

    case "Literal": {
      return `(= ${instr.dest} (literal ${formatValue(instr.value)}))`
    }

    case "Identity": {
      return `(= ${instr.dest} (identity ${instr.source}))`
    }

    case "Assert": {
      return `(assert ${instr.condition})`
    }

    case "Return": {
      if (instr.result !== undefined) {
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
      const fn = formatValue(instr.fn)
      const args = instr.args.join(" ")
      const rhs = args === "" ? `(call ${fn})` : `(call ${fn} ${args})`
      return `(= ${instr.dest} ${rhs})`
    }

    case "Apply": {
      const rhs = `(apply ${instr.target} ${instr.arg})`
      return `(= ${instr.dest} ${rhs})`
    }

    case "ApplyNullary": {
      const rhs = `(apply-nullary ${instr.target})`
      return `(= ${instr.dest} ${rhs})`
    }

    case "Load": {
      const rhs = `(load ${instr.name})`
      return `(= ${instr.dest} ${rhs})`
    }

    case "Store": {
      return `(store ${instr.name} ${instr.source})`
    }
  }
}
