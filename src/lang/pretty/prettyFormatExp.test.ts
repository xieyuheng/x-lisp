import * as X from "@xieyuheng/x-data.js"
import { test } from "node:test"
import type { Exp } from "../exp/index.ts"
import { matchExp } from "../syntax/index.ts"
import { prettyFormatExp } from "./index.ts"

function testExps(code: string) {
  const sexps = X.parseDataArray(code)
  const exps = sexps.map<Exp>(matchExp)

  for (const exp of exps) {
    console.log(prettyFormatExp(30, exp))
    console.log(prettyFormatExp(20, exp))
    console.log(prettyFormatExp(10, exp))
  }
}

test("prettyFormatExp", () => {
  testExps(`
(lambda (f x y) (f y x))
`)
})
