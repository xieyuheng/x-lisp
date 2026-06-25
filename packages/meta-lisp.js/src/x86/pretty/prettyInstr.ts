import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"
import { prettyOperand } from "./prettyOperand.ts"

export function prettyInstr(instr: X86.Instr): Ppml.Node {
  const operandNodes = instr.operands.map(prettyOperand)
  return Ppml.prettySyntax(instr.op, [], operandNodes)
}
