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
  const widths = [30, 20, 10]
  for (const width of widths) {
    console.log(`${"-".repeat(width)}|${width}`)
    console.log(pp.format(width, exampleNode))
  }
})
