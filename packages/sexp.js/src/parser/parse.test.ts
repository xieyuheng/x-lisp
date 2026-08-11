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
  assertParse("abc", S.SymbolSexp("abc", S.zeroLocation("[test]")))
  assertParse("3-sphere", S.SymbolSexp("3-sphere", S.zeroLocation("[test]")))
  assertParse("3f2c1", S.SymbolSexp("3f2c1", S.zeroLocation("[test]")))
  assertParse(
    "3f2c1a8d/builtin/int-add",
    S.SymbolSexp("3f2c1a8d/builtin/int-add", S.zeroLocation("[test]")),
  )
})

test("parse -- string", () => {
  assertParse('"abc"', S.StringSexp("abc", S.zeroLocation("[test]")))
})

test("parse -- number", () => {
  assertParse("1", S.IntSexp(1n, S.zeroLocation("[test]")))
  assertParse("0", S.IntSexp(0n, S.zeroLocation("[test]")))
  assertParse("-1", S.IntSexp(-1n, S.zeroLocation("[test]")))
  assertParse("0.0", S.FloatSexp(0.0, S.zeroLocation("[test]")))
  assertParse("3.14", S.FloatSexp(3.14, S.zeroLocation("[test]")))
})

test("parse -- round brackets", () => {
  assertParse("()", S.ListSexp([], S.zeroLocation("[test]")))
  assertParse(
    "(a b c)",
    S.ListSexp(
      [
        S.SymbolSexp("a", S.zeroLocation("[test]")),
        S.SymbolSexp("b", S.zeroLocation("[test]")),
        S.SymbolSexp("c", S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "(a (b) c)",
    S.ListSexp(
      [
        S.SymbolSexp("a", S.zeroLocation("[test]")),
        S.ListSexp(
          [S.SymbolSexp("b", S.zeroLocation("[test]"))],
          S.zeroLocation("[test]"),
        ),
        S.SymbolSexp("c", S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
})

test("parse -- square brackets", () => {
  assertParse(
    "[]",
    S.ListSexp(
      [S.SymbolSexp("@square-bracket", S.zeroLocation("[test]"))],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "[a b c]",
    S.ListSexp(
      [
        S.SymbolSexp("@square-bracket", S.zeroLocation("[test]")),
        S.SymbolSexp("a", S.zeroLocation("[test]")),
        S.SymbolSexp("b", S.zeroLocation("[test]")),
        S.SymbolSexp("c", S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
})

test("parse -- flower brackets", () => {
  assertParse(
    "{}",
    S.ListSexp(
      [S.SymbolSexp("@curly-bracket", S.zeroLocation("[test]"))],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "{:x 1 :y 2}",
    S.ListSexp(
      [
        S.SymbolSexp("@curly-bracket", S.zeroLocation("[test]")),
        S.SymbolSexp(":x", S.zeroLocation("[test]")),
        S.IntSexp(BigInt(1), S.zeroLocation("[test]")),
        S.SymbolSexp(":y", S.zeroLocation("[test]")),
        S.IntSexp(BigInt(2), S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
})

test("parse -- quotes", () => {
  assertParse(
    "'a",
    S.ListSexp(
      [
        S.SymbolSexp("@quote", S.zeroLocation("[test]")),
        S.SymbolSexp("a", S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "'(a)",
    S.ListSexp(
      [
        S.SymbolSexp("@quote", S.zeroLocation("[test]")),
        S.ListSexp(
          [S.SymbolSexp("a", S.zeroLocation("[test]"))],
          S.zeroLocation("[test]"),
        ),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "'(:a)",
    S.ListSexp(
      [
        S.SymbolSexp("@quote", S.zeroLocation("[test]")),
        S.ListSexp(
          [S.SymbolSexp(":a", S.zeroLocation("[test]"))],
          S.zeroLocation("[test]"),
        ),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "'(a b c)",
    S.ListSexp(
      [
        S.SymbolSexp("@quote", S.zeroLocation("[test]")),
        S.ListSexp(
          [
            S.SymbolSexp("a", S.zeroLocation("[test]")),
            S.SymbolSexp("b", S.zeroLocation("[test]")),
            S.SymbolSexp("c", S.zeroLocation("[test]")),
          ],
          S.zeroLocation("[test]"),
        ),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    ",(a b c)",
    S.ListSexp(
      [
        S.SymbolSexp("@unquote", S.zeroLocation("[test]")),
        S.ListSexp(
          [
            S.SymbolSexp("a", S.zeroLocation("[test]")),
            S.SymbolSexp("b", S.zeroLocation("[test]")),
            S.SymbolSexp("c", S.zeroLocation("[test]")),
          ],
          S.zeroLocation("[test]"),
        ),
      ],
      S.zeroLocation("[test]"),
    ),
  )
  assertParse(
    "`(a ,b c)",
    S.ListSexp(
      [
        S.SymbolSexp("@quasiquote", S.zeroLocation("[test]")),
        S.ListSexp(
          [
            S.SymbolSexp("a", S.zeroLocation("[test]")),
            S.ListSexp(
              [
                S.SymbolSexp("@unquote", S.zeroLocation("[test]")),
                S.SymbolSexp("b", S.zeroLocation("[test]")),
              ],
              S.zeroLocation("[test]"),
            ),
            S.SymbolSexp("c", S.zeroLocation("[test]")),
          ],
          S.zeroLocation("[test]"),
        ),
      ],
      S.zeroLocation("[test]"),
    ),
  )
})
