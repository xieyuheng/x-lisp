import { type Instr } from "../instr/index.ts"
import { formatExp } from "./formatExp.ts"

export function formatInstr(instr: Instr): string {
  switch (instr.kind) {
    case "Assign": {
      return `(= ${instr.dest} ${formatExp(instr.exp)})`
    }

    case "Perform": {
      return `(perform ${formatExp(instr.exp)})`
    }

    case "Test": {
      return `(test ${formatExp(instr.exp)})`
    }

    case "Branch": {
      return `(branch ${instr.thenLabel} ${instr.elseLabel})`
    }

    case "Goto": {
      return `(goto ${instr.label})`
    }

    case "Return": {
      return `(return ${formatExp(instr.exp)})`
    }
  }
}
