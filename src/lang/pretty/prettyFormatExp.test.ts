import * as X from "@xieyuheng/x-data.js"
import { test } from "node:test"
import type { Exp } from "../exp/index.ts"
import { matchExp } from "../syntax/index.ts"
import { prettyFormatExp } from "./index.ts"

function testWidths(widths: Array<number>, code: string) {
  const sexps = X.parseDataArray(code)
  const exps = sexps.map<Exp>(matchExp)

  for (const exp of exps) {
    for (const width of widths) {
      console.log(`${"-".repeat(width)}|${width}`)
      console.log(prettyFormatExp(width, exp))
    }
  }
}

test("prettyFormatExp", () => {
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

test("prettyFormatExp -- set", () => {
  testWidths([30, 20, 10], `{{1 2 3} {4 5 6} {7 8 9}}`)
})

test("prettyFormatExp -- list", () => {
  testWidths([30, 20, 10], `[[1 2 3] [4 5 6] [7 8 9]]`)
})

test("prettyFormatExp -- hash", () => {
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
