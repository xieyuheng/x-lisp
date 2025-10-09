import { test } from "node:test"
import * as PPML from "./index.ts"

const exampleNode = PPML.concatNode([
  PPML.TextNode("begin"),
  PPML.IndentNode(
    3,
    PPML.AppendNode(
      PPML.BreakNode(" "),
      PPML.GroupNode(
        PPML.concatNode([
          PPML.TextNode("stmt"),
          PPML.BreakNode(" "),
          PPML.TextNode("stmt"),
          PPML.BreakNode(" "),
          PPML.TextNode("stmt"),
        ]),
      ),
    ),
  ),
  PPML.BreakNode(" "),
  PPML.TextNode("end"),
])

test("ppml", () => {
  console.log(PPML.format(30, exampleNode))
  console.log(PPML.format(20, exampleNode))
  console.log(PPML.format(10, exampleNode))
})
