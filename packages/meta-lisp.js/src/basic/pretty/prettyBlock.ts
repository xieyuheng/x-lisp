import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"
import { prettyInstr } from "./prettyInstr.ts"

export function prettyBlock(block: B.Block): Ppml.Node {
  return Ppml.prettyVertical(
    "block",
    [Ppml.text(block.label)],
    block.instrs.map(prettyInstr),
  )
}
