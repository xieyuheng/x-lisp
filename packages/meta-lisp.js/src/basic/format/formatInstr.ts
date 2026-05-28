import { type Instr } from "../instr/index.ts"
import { formatExp } from "./formatExp.ts"

export function formatInstr(instr: Instr): string {
  switch (instr.kind) {
    case "AssignInstr": {
      return `(= ${instr.dest} ${formatExp(instr.exp)})`
    }

    case "PerformInstr": {
      return `(perform ${formatExp(instr.exp)})`
    }

    case "TestInstr": {
      return `(test ${formatExp(instr.exp)})`
    }

    case "BranchInstr": {
      return `(branch ${instr.thenLabel} ${instr.elseLabel})`
    }

    case "GotoInstr": {
      return `(goto ${instr.label})`
    }

    case "ReturnInstr": {
      return `(return ${formatExp(instr.exp)})`
    }
  }
}
