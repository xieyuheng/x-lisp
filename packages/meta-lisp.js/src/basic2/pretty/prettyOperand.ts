import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"

export function prettyOperand(operand: B.Operand): Ppml.Node {
  return Ppml.text(operand.name)
}
