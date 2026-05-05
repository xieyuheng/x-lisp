import { test } from "node:test"
import * as S from "../index.ts"

function assertParse(text: string, expected: S.Sexp): void {
  const sexp = S.parseSexp(text, { path: "[assertParse]" })
  const ok = S.sexpEqual(expected, sexp)
  if (!ok) {
    let message = `[assertParse] fail\n`
    message += `  sexp: ${S.formatSexp(sexp)}\n`
    message += `  expected: ${S.formatSexp(expected)}\n`
    throw new Error(message)
  }
}

test("parse -- symbol", () => {
  assertParse("abc", S.Symbol("abc"))
  assertParse("3-sphere", S.Symbol("3-sphere"))
})

test("parse -- string", () => {
  assertParse('"abc"', S.String("abc"))
})

test("parse -- keyword", () => {
  assertParse(":t", S.Keyword("t"))
  assertParse(":f", S.Keyword("f"))
  assertParse(":null", S.Keyword("null"))
  assertParse(":void", S.Keyword("void"))
})

test("parse -- number", () => {
  assertParse("1", S.Int(1n))
  assertParse("0", S.Int(0n))
  assertParse("-1", S.Int(-1n))
  assertParse("0.0", S.Float(0.0))
  assertParse("3.14", S.Float(3.14))
})

test("parse -- round brackets", () => {
  assertParse("()", S.List([]))
  assertParse("(a b c)", S.List([S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]))
  assertParse(
    "(a (b) c)",
    S.List([S.Symbol("a"), S.List([S.Symbol("b")]), S.Symbol("c")]),
  )
})

test("parse -- square brackets", () => {
  assertParse("[]", S.List([S.Symbol("@list")]))
  assertParse(
    "[a b c]",
    S.List([S.Symbol("@list"), S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]),
  )
})

test("parse -- flower brackets", () => {
  assertParse("{}", S.List([S.Symbol("@record")]))
  assertParse(
    "{:x 1 :y 2}",
    S.List([
      S.Symbol("@record"),
      S.Keyword("x"),
      S.Int(BigInt(1)),
      S.Keyword("y"),
      S.Int(BigInt(2)),
    ]),
  )
})

test("parse -- quotes", () => {
  assertParse("'a", S.List([S.Symbol("@quote"), S.Symbol("a")]))
  assertParse("'(a)", S.List([S.Symbol("@quote"), S.List([S.Symbol("a")])]))
  assertParse("'(:a)", S.List([S.Symbol("@quote"), S.List([S.Keyword("a")])]))
  assertParse(
    "'(a b c)",
    S.List([
      S.Symbol("@quote"),
      S.List([S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]),
    ]),
  )
  assertParse(
    ",(a b c)",
    S.List([
      S.Symbol("@unquote"),
      S.List([S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]),
    ]),
  )
  assertParse(
    "`(a ,b c)",
    S.List([
      S.Symbol("@quasiquote"),
      S.List([
        S.Symbol("a"),
        S.List([S.Symbol("@unquote"), S.Symbol("b")]),
        S.Symbol("c"),
      ]),
    ]),
  )
})
