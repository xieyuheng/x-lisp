import { type Instr } from "./Instr.ts"

export function isTerminator(instr: Instr): boolean {
  return ["Return", "Goto", "Branch"].includes(instr.op)
}
