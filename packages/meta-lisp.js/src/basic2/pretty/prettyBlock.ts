import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"
import { prettyInstr } from "./prettyInstr.ts"
import { prettyTerminator } from "./prettyTerminator.ts"
import { prettyType } from "./prettyType.ts"

export function prettyBlock(block: B.Block): Ppml.Node {
  const bodyNodes: Array<Ppml.Node> = [
    ...block.instrs.map(prettyInstr),
    prettyTerminator(block.terminator),
  ]

  if (block.parameters.length === 0) {
    return Ppml.prettySyntax("block", [Ppml.text(block.label)], bodyNodes)
  }

  const paramNodes = block.parameters.map(([name, type]) =>
    Ppml.prettySyntax("", [], [Ppml.text(name), prettyType(type)]),
  )

  return Ppml.prettySyntax(
    "block",
    [Ppml.prettySyntax(block.label, [], paramNodes)],
    bodyNodes,
  )
}
