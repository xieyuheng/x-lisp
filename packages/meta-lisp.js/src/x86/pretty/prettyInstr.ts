import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"
import { prettyOperand } from "./prettyOperand.ts"

export function prettyInstr(instr: X86.Instr): Ppml.Node {
  if (instr.op === "label") {
    const operands = instr.operands.map(prettyOperand)
    if (operands.length === 0) return Ppml.nil()
    if (operands.length === 1) return operands[0]
    return Ppml.flex(operands)
  }
  const operandNodes = instr.operands.map(prettyOperand)
  return Ppml.prettySyntax(instr.op, [], operandNodes)
}
