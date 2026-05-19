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
  assertParse("abc", S.Symbol("abc", S.zeroLocation("[test]")))
  assertParse("3-sphere", S.Symbol("3-sphere", S.zeroLocation("[test]")))
})

test("parse -- string", () => {
  assertParse('"abc"', S.String("abc", S.zeroLocation("[test]")))
})

test("parse -- keyword", () => {
  assertParse(":t", S.Keyword("t", S.zeroLocation("[test]")))
  assertParse(":f", S.Keyword("f", S.zeroLocation("[test]")))
  assertParse(":null", S.Keyword("null", S.zeroLocation("[test]")))
  assertParse(":void", S.Keyword("void", S.zeroLocation("[test]")))
})

test("parse -- number", () => {
  assertParse("1", S.Int(1n, S.zeroLocation("[test]")))
  assertParse("0", S.Int(0n, S.zeroLocation("[test]")))
  assertParse("-1", S.Int(-1n, S.zeroLocation("[test]")))
  assertParse("0.0", S.Float(0.0, S.zeroLocation("[test]")))
  assertParse("3.14", S.Float(3.14, S.zeroLocation("[test]")))
})

test("parse -- round brackets", () => {
  assertParse("()", S.List([], S.zeroLocation("[test]")))
  assertParse(
    "(a b c)",
    S.List(
      [
        S.Symbol("a", S.zeroLocation("[test]")),
        S.Symbol("b", S.zeroLocation("[test]")),
        S.Symbol("c", S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "(a (b) c)",
    S.List(
      [
        S.Symbol("a", S.zeroLocation("[test]")),
        S.List([S.Symbol("b", S.zeroLocation("[test]"))], S.zeroLocation("[test]")),
        S.Symbol("c", S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
})

test("parse -- square brackets", () => {
  assertParse(
    "[]",
    S.List([S.Symbol("@square-bracket", S.zeroLocation("[test]"))], S.zeroLocation("[test]")),
  )
  assertParse(
    "[a b c]",
    S.List(
      [
        S.Symbol("@square-bracket", S.zeroLocation("[test]")),
        S.Symbol("a", S.zeroLocation("[test]")),
        S.Symbol("b", S.zeroLocation("[test]")),
        S.Symbol("c", S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
})

test("parse -- flower brackets", () => {
  assertParse(
    "{}",
    S.List([S.Symbol("@curly-bracket", S.zeroLocation("[test]"))], S.zeroLocation("[test]")),
  )
  assertParse(
    "{:x 1 :y 2}",
    S.List(
      [
        S.Symbol("@curly-bracket", S.zeroLocation("[test]")),
        S.Keyword("x", S.zeroLocation("[test]")),
        S.Int(BigInt(1), S.zeroLocation("[test]")),
        S.Keyword("y", S.zeroLocation("[test]")),
        S.Int(BigInt(2), S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
})

test("parse -- quotes", () => {
  assertParse(
    "'a",
    S.List(
      [S.Symbol("@quote", S.zeroLocation("[test]")), S.Symbol("a", S.zeroLocation("[test]"))],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "'(a)",
    S.List(
      [
        S.Symbol("@quote", S.zeroLocation("[test]")),
        S.List([S.Symbol("a", S.zeroLocation("[test]"))], S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "'(:a)",
    S.List(
      [
        S.Symbol("@quote", S.zeroLocation("[test]")),
        S.List([S.Keyword("a", S.zeroLocation("[test]"))], S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "'(a b c)",
    S.List(
      [
        S.Symbol("@quote", S.zeroLocation("[test]")),
        S.List(
          [
            S.Symbol("a", S.zeroLocation("[test]")),
            S.Symbol("b", S.zeroLocation("[test]")),
            S.Symbol("c", S.zeroLocation("[test]")),
          ],
          S.zeroLocation("[test]"),
        ),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    ",(a b c)",
    S.List(
      [
        S.Symbol("@unquote", S.zeroLocation("[test]")),
        S.List(
          [
            S.Symbol("a", S.zeroLocation("[test]")),
            S.Symbol("b", S.zeroLocation("[test]")),
            S.Symbol("c", S.zeroLocation("[test]")),
          ],
          S.zeroLocation("[test]"),
        ),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "`(a ,b c)",
    S.List(
      [
        S.Symbol("@quasiquote", S.zeroLocation("[test]")),
        S.List(
          [
            S.Symbol("a", S.zeroLocation("[test]")),
            S.List(
              [
                S.Symbol("@unquote", S.zeroLocation("[test]")),
                S.Symbol("b", S.zeroLocation("[test]")),
              ],
              S.zeroLocation("[test]"),
            ),
            S.Symbol("c", S.zeroLocation("[test]")),
          ],
          S.zeroLocation("[test]"),
        ),
      ],
      S.zeroLocation("[test]"),
    ),
  )
})
