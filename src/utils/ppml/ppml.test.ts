import assert from "node:assert"
import { test } from "node:test"
import * as PPML from "./index.ts"

test("ppml", () => {
  assert

  console.log(
    PPML.concatNode([
      PPML.TextNode("a"),
      PPML.TextNode("b"),
      PPML.TextNode("c"),
      PPML.NullNode(),
    ]),
  )
})
