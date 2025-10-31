import * as X from "@xieyuheng/x-sexp.js"
import { test } from "node:test"
import { emptyEnv } from "../env/index.ts"
import { evaluate, resultValue } from "../evaluate/index.ts"
import type { Exp } from "../exp/index.ts"
import { createMod } from "../mod/index.ts"
import { matchExp } from "../syntax/index.ts"
import { prettyValue } from "./index.ts"

function testWidths(widths: Array<number>, code: string) {
  const sexps = X.parseSexps(code)
  const exps = sexps.map<Exp>(matchExp)

  for (const exp of exps) {
    const url = new URL("test:")
    const mod = createMod(url)
    const value = resultValue(evaluate(exp)(mod, emptyEnv()))
    for (const width of widths) {
      console.log(`${"-".repeat(width)}|${width}`)
      console.log(prettyValue(width, value))
    }
  }
}

test("prettyValue -- lambda", () => {
  testWidths([30, 20, 13, 10, 5], `(lambda (f x y) (f y x))`)
  testWidths([30, 20, 13, 10, 5], `(lambda (f x y) (begin (f y x)))`)
  testWidths(
    [60, 30],
    `
(lambda (f list)
  (= new-hash (@hash))
  (pipe list
    (list-each
     (lambda (value)
       (= key (f value))
       (= group (hash-get key new-hash))
       (if (null? group)
         (hash-put! key [value] new-hash)
         (list-push! value group)))))
  new-hash)
`,
  )
})

test("prettyValue -- tau", () => {
  testWidths([20, 10], `(tau 1 2 3)`)
})

test("prettyValue -- set", () => {
  testWidths([30, 20, 10], `{{1 2 3} {4 5 6} {7 8 9}}`)
})

test("prettyValue -- list", () => {
  testWidths([30, 20, 10], `[[1 2 3] [4 5 6] [7 8 9]]`)
})

test("prettyValue -- hash", () => {
  testWidths(
    [60, 30, 10, 5],
    `
(@hash
  "x" (@hash "x" 1 "y" 2 "z" 3)
  "y" (@hash "x" 4 "y" 5 "z" 6)
  "z" (@hash "x" 7 "y" 8 "z" 9))
`,
  )
})
