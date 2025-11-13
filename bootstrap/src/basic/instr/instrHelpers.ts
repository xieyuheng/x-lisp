import { type Instr } from "./Instr.ts"

export function isTerminator(instr: Instr): boolean {
  return ["Return", "Goto", "Branch"].includes(instr.op)
}

export function instrDest(instr: Instr): string | undefined {
  if ("dest" in instr) {
    return instr.dest
  }
}
