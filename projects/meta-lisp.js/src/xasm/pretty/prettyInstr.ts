import * as Ppml from "@xieyuheng/ppml.js"
import { type Instr } from "../instr/index.ts"
import { prettySyntax } from "./layout.ts"
import { prettyOperand } from "./prettyOperand.ts"

export function prettyInstr(instr: Instr): Ppml.Node {
  if (instr.op === "label") {
    if (instr.operands.length === 0) {
      return Ppml.nil()
    } else if (instr.operands.length === 1) {
      return prettyOperand(instr.operands[0])
    } else {
      return Ppml.flex(instr.operands.map(prettyOperand))
    }
  }

  const operandNodes = instr.operands.map(prettyOperand)
  return prettySyntax(instr.op, [], operandNodes)
}
