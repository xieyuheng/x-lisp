import type { Instr } from "./Instr.ts"

export function instrDest(instr: Instr): string | undefined {
  if ("dest" in instr) {
    return instr.dest
  }
}

export function instrOperands(instr: Instr): Array<string> {
  if ("operands" in instr) {
    return instr.operands
  } else {
    return []
  }
}
