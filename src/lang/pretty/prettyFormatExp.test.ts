import * as X from "@xieyuheng/x-data.js"
import { test } from "node:test"
import type { Exp } from "../exp/index.ts"
import { matchExp } from "../syntax/index.ts"
import { prettyFormatExp } from "./index.ts"

function testExps(code: string) {
  const sexps = X.parseDataArray(code)
  const exps = sexps.map<Exp>(matchExp)

  const widths = [30, 20, 13, 10, 5]
  for (const exp of exps) {
    for (const width of widths) {
      console.log("-".repeat(width) + "|", width)
      console.log(prettyFormatExp(width, exp))
    }
  }
}

test("prettyFormatExp", () => {
  testExps(`(lambda (f x y) (f y x))`)
  testExps(`(lambda (f x y) (begin (f y x)))`)
})
