import { snapshot } from "@xieyuheng/helpers.js/snapshot"
import Path from "node:path"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import * as S from "../index.ts"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))
const snapshotDir = Path.join(currentDir, "..", "..", "snapshot")

function testWidths(widths: Array<number>, code: string): string {
  const lines: Array<string> = []
  const sexps = S.parseSexps(code, { path: "[testWidths]" })
  for (const sexp of sexps) {
    for (const width of widths) {
      lines.push(`${"-".repeat(width)}|${width}`)
      lines.push(S.prettySexp(width, sexp))
    }
  }
  return lines.join("\n") + "\n"
}

test("prettySexp.lambda", () => {
  const output =
    testWidths([30, 20, 13, 10, 5], `(lambda (f x y) (f y x))`) +
    testWidths([30, 20, 13, 10, 5], `(lambda (f x y) (begin (f y x)))`) +
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
  snapshot(snapshotDir, "pretty/prettySexp.lambda.test.out", output)
})

test("prettySexp.set", () => {
  const output = testWidths([30, 20, 10], `{{1 2 3} {4 5 6} {7 8 9}}`)
  snapshot(snapshotDir, "pretty/prettySexp.set.test.out", output)
})

test("prettySexp.list", () => {
  const output = testWidths([30, 20, 10], `[[1 2 3] [4 5 6] [7 8 9]]`)
  snapshot(snapshotDir, "pretty/prettySexp.list.test.out", output)
})

test("prettySexp.hash", () => {
  const output = testWidths(
    [60, 30, 10, 5],
    `
(@hash
  "x" (@hash "x" 1 "y" 2 "z" 3)
  "y" (@hash "x" 4 "y" 5 "z" 6)
  "z" (@hash "x" 7 "y" 8 "z" 9))
`,
  )
  snapshot(snapshotDir, "pretty/prettySexp.hash.test.out", output)
})
