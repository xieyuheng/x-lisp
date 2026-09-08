import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"

export function prettyInstr(instr: B.Instr): Ppml.Node {
  return Ppml.text(B.formatInstr(instr))
}
