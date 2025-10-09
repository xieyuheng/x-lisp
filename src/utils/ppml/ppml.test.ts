import { test } from "node:test"
import * as pp from "./index.ts"

const exampleNode = pp.concat(
  pp.text("begin"),
  pp.indent(
    3,
    pp.br(),
    pp.group(
      pp.text("stmt"),
      pp.br(),
      pp.text("stmt"),
      pp.br(),
      pp.text("stmt"),
    ),
  ),
  pp.br(),
  pp.text("end"),
)

test("ppml", () => {
  console.log(pp.format(30, exampleNode))
  console.log(pp.format(20, exampleNode))
  console.log(pp.format(10, exampleNode))
})
