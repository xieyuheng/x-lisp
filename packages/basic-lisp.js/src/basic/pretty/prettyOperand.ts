import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"

export function prettyOperand(cell: B.Cell): Ppml.Node {
  return Ppml.text(cell.id)
}
