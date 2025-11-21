import { test } from "node:test"
import { formatSexp } from "../format/index.ts"
import * as S from "../sexp/index.ts"
import { parseSexp } from "./index.ts"

function assertParse(text: string, expected: S.Sexp): void {
  const sexp = parseSexp(text)
  const ok = S.sexpEqual(expected, sexp)
  if (!ok) {
    let message = `[assertParse] fail\n`
    message += `  sexp: ${formatSexp(sexp)}\n`
    message += `  expected: ${formatSexp(expected)}\n`
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

test("parse -- hashtag", () => {
  assertParse("#t", S.Hashtag("t"))
  assertParse("#f", S.Hashtag("f"))
  assertParse("#null", S.Hashtag("null"))
  assertParse("#void", S.Hashtag("void"))
})

test("parse -- number", () => {
  assertParse("1", S.Int(1))
  assertParse("0", S.Int(0))
  assertParse("-1", S.Int(-1))
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
  assertParse("[]", S.List([S.Symbol("@tael")]))
  assertParse(
    "[a b c]",
    S.List([S.Symbol("@tael"), S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]),
  )
})

test("parse -- flower brackets", () => {
  assertParse("{}", S.List([S.Symbol("@set")]))
  assertParse(
    "{a b c}",
    S.List([S.Symbol("@set"), S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]),
  )
})

test("parse -- list with attributes", () => {
  assertParse("(:x 1 :y 2)", S.Record({ x: S.Int(1), y: S.Int(2) }))
  assertParse(
    "(a b c :x 1 :y 2)",
    S.Tael([S.Symbol("a"), S.Symbol("b"), S.Symbol("c")], {
      x: S.Int(1),
      y: S.Int(2),
    }),
  )
})

test("parse -- quotes", () => {
  assertParse("'a", S.List([S.Symbol("@quote"), S.Symbol("a")]))
  assertParse("'(a)", S.List([S.Symbol("@quote"), S.List([S.Symbol("a")])]))
  assertParse("'(#a)", S.List([S.Symbol("@quote"), S.List([S.Hashtag("a")])]))
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
