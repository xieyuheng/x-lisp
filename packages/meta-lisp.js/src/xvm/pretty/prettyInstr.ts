import * as Ppml from "@xieyuheng/ppml.js"
import * as Xvm from "../index.ts"
import { type Instr } from "../instr/index.ts"

export function prettyInstr(instr: Instr): Ppml.Node {
  return Ppml.text(Xvm.formatInstr(instr))
}
