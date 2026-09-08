import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"

export function prettyInstr(instr: X86.Instr): Ppml.Node {
  return Ppml.text(X86.formatInstr(instr))
}
