import * as Ppml from "@xieyuheng/ppml.js"
import * as N from "../index.ts"
import { prettyInstr } from "./prettyInstr.ts"

export function prettyBlock(block: N.Block): Ppml.Node {
  const instrNodes = block.instrs.map(prettyInstr)
  return Ppml.prettySyntax("block", [Ppml.text(block.name)], instrNodes)
}
