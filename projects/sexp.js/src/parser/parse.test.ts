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
  assertParse("abc", S.Symbol("abc", S.zeroLocation()))
  assertParse("3-sphere", S.Symbol("3-sphere", S.zeroLocation()))
})

test("parse -- string", () => {
  assertParse('"abc"', S.String("abc", S.zeroLocation()))
})

test("parse -- keyword", () => {
  assertParse(":t", S.Keyword("t", S.zeroLocation()))
  assertParse(":f", S.Keyword("f", S.zeroLocation()))
  assertParse(":null", S.Keyword("null", S.zeroLocation()))
  assertParse(":void", S.Keyword("void", S.zeroLocation()))
})

test("parse -- number", () => {
  assertParse("1", S.Int(1n, S.zeroLocation()))
  assertParse("0", S.Int(0n, S.zeroLocation()))
  assertParse("-1", S.Int(-1n, S.zeroLocation()))
  assertParse("0.0", S.Float(0.0, S.zeroLocation()))
  assertParse("3.14", S.Float(3.14, S.zeroLocation()))
})

test("parse -- round brackets", () => {
  assertParse("()", S.List([], S.zeroLocation()))
  assertParse(
    "(a b c)",
    S.List(
      [
        S.Symbol("a", S.zeroLocation()),
        S.Symbol("b", S.zeroLocation()),
        S.Symbol("c", S.zeroLocation()),
      ],
      S.zeroLocation(),
    ),
  )
  assertParse(
    "(a (b) c)",
    S.List(
      [
        S.Symbol("a", S.zeroLocation()),
        S.List([S.Symbol("b", S.zeroLocation())], S.zeroLocation()),
        S.Symbol("c", S.zeroLocation()),
      ],
      S.zeroLocation(),
    ),
  )
})

test("parse -- square brackets", () => {
  assertParse(
    "[]",
    S.List([S.Symbol("@square-bracket", S.zeroLocation())], S.zeroLocation()),
  )
  assertParse(
    "[a b c]",
    S.List(
      [
        S.Symbol("@square-bracket", S.zeroLocation()),
        S.Symbol("a", S.zeroLocation()),
        S.Symbol("b", S.zeroLocation()),
        S.Symbol("c", S.zeroLocation()),
      ],
      S.zeroLocation(),
    ),
  )
})

test("parse -- flower brackets", () => {
  assertParse(
    "{}",
    S.List([S.Symbol("@curly-bracket", S.zeroLocation())], S.zeroLocation()),
  )
  assertParse(
    "{:x 1 :y 2}",
    S.List(
      [
        S.Symbol("@curly-bracket", S.zeroLocation()),
        S.Keyword("x", S.zeroLocation()),
        S.Int(BigInt(1), S.zeroLocation()),
        S.Keyword("y", S.zeroLocation()),
        S.Int(BigInt(2), S.zeroLocation()),
      ],
      S.zeroLocation(),
    ),
  )
})

test("parse -- quotes", () => {
  assertParse(
    "'a",
    S.List(
      [S.Symbol("@quote", S.zeroLocation()), S.Symbol("a", S.zeroLocation())],
      S.zeroLocation(),
    ),
  )
  assertParse(
    "'(a)",
    S.List(
      [
        S.Symbol("@quote", S.zeroLocation()),
        S.List([S.Symbol("a", S.zeroLocation())], S.zeroLocation()),
      ],
      S.zeroLocation(),
    ),
  )
  assertParse(
    "'(:a)",
    S.List(
      [
        S.Symbol("@quote", S.zeroLocation()),
        S.List([S.Keyword("a", S.zeroLocation())], S.zeroLocation()),
      ],
      S.zeroLocation(),
    ),
  )
  assertParse(
    "'(a b c)",
    S.List(
      [
        S.Symbol("@quote", S.zeroLocation()),
        S.List(
          [
            S.Symbol("a", S.zeroLocation()),
            S.Symbol("b", S.zeroLocation()),
            S.Symbol("c", S.zeroLocation()),
          ],
          S.zeroLocation(),
        ),
      ],
      S.zeroLocation(),
    ),
  )
  assertParse(
    ",(a b c)",
    S.List(
      [
        S.Symbol("@unquote", S.zeroLocation()),
        S.List(
          [
            S.Symbol("a", S.zeroLocation()),
            S.Symbol("b", S.zeroLocation()),
            S.Symbol("c", S.zeroLocation()),
          ],
          S.zeroLocation(),
        ),
      ],
      S.zeroLocation(),
    ),
  )
  assertParse(
    "`(a ,b c)",
    S.List(
      [
        S.Symbol("@quasiquote", S.zeroLocation()),
        S.List(
          [
            S.Symbol("a", S.zeroLocation()),
            S.List(
              [
                S.Symbol("@unquote", S.zeroLocation()),
                S.Symbol("b", S.zeroLocation()),
              ],
              S.zeroLocation(),
            ),
            S.Symbol("c", S.zeroLocation()),
          ],
          S.zeroLocation(),
        ),
      ],
      S.zeroLocation(),
    ),
  )
})
