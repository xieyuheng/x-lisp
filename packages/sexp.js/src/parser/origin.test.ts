import assert from "node:assert/strict"
import { test } from "node:test"
import * as S from "../index.ts"

test("parse -- origin for an atom", () => {
  const origin = { index: 100, row: 10, column: 5 }
  const sexp = S.parseSexp("abc", { path: "test.md", origin })

  assert.deepEqual(sexp.location.span.start, origin)
  assert.deepEqual(sexp.location.span.end, {
    index: 103,
    row: 10,
    column: 8,
  })
})

test("parse -- origin across lines", () => {
  const text = "(a\nb)"
  const sexp = S.parseSexp(text, {
    path: "test.md",
    origin: { index: 50, row: 5, column: 2 },
  })

  assert.deepEqual(sexp.location.span.start, {
    index: 50,
    row: 5,
    column: 2,
  })
  assert.deepEqual(sexp.location.span.end, {
    index: 55,
    row: 6,
    column: 2,
  })
})

test("parse -- origin without origin is unchanged", () => {
  const sexp = S.parseSexp("abc", { path: "test.md" })

  assert.deepEqual(sexp.location.span.start, S.initPosition())
  assert.deepEqual(sexp.location.span.end, {
    index: 3,
    row: 0,
    column: 3,
  })
})

test("parse -- origin for an error", () => {
  const text = "(a"

  assert.throws(
    () =>
      S.parseSexp(text, {
        path: "test.md",
        origin: { index: 20, row: 2, column: 3 },
      }),
    (error: unknown) => {
      assert.ok(error instanceof S.ErrorWithSourceLocation)
      assert.deepEqual(error.location.span.start, {
        index: 20,
        row: 2,
        column: 3,
      })
      return true
    },
  )
})
