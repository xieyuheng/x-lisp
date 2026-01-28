import { type Instr } from "../instr/index.ts"
import { formatExp } from "./formatExp.ts"

export function formatInstr(instr: Instr): string {
  switch (instr.kind) {
    case "Assign": {
      return `(assign ${instr.dest} ${formatExp(instr.exp)})`
    }

    case "Perform": {
      return `(perform ${formatExp(instr.exp)})`
    }

    case "Test": {
      return `(test ${formatExp(instr.exp)})`
    }

    case "Branch": {
      return `(branch ${formatExp(instr.exp)})`
    }

    case "Goto": {
      return `(goto ${formatExp(instr.exp)})`
    }

    case "Return": {
      return `(return ${formatExp(instr.exp)})`
    }
  }
}
