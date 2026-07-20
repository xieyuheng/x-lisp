import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"
import { prettyInstr } from "./prettyInstr.ts"

export function prettyBlock(block: X86.Block): Ppml.Node {
  const instrNodes = block.instrs.map(prettyInstr)
  return Ppml.prettyVertical("block", [Ppml.text(block.label)], instrNodes)
}
