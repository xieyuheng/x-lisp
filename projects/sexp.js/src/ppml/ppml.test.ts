import { test } from "node:test"
import * as Ppml from "./index.ts"

const exampleNode = Ppml.concat(
  Ppml.text("begin"),
  Ppml.indent(
    3,
    Ppml.br(),
    Ppml.group(
      Ppml.text("stmt"),
      Ppml.br(),
      Ppml.text("stmt"),
      Ppml.br(),
      Ppml.text("stmt"),
    ),
  ),
  Ppml.br(),
  Ppml.text("end"),
)

test("ppml", () => {
  const widths = [30, 20, 10]
  for (const width of widths) {
    console.log(`${"-".repeat(width)}|${width}`)
    console.log(Ppml.format(width, exampleNode))
  }
})
