import assert from "node:assert"
import { test } from "node:test"
import * as S from "../index.ts"

const testOptions = { path: "[matchSexp.test]" }

function assertMatch(
  patternInput: string,
  sexpInput: string | S.Sexp,
  expectedSubst: S.Subst,
): void {
  const pattern = S.parseSexp(patternInput, testOptions)
  const sexp =
    typeof sexpInput === "string"
      ? S.parseSexp(sexpInput, testOptions)
      : sexpInput
  const subst = S.matchSexp("NormalMode", pattern, sexp)({})
  assert(subst)
  assert(S.sexpEqualRecord(subst, expectedSubst))
}

function assertMatchFail(patternInput: string, sexpInput: string): void {
  const subst = S.matchSexp(
    "NormalMode",
    S.parseSexp(patternInput, testOptions),
    S.parseSexp(sexpInput, testOptions),
  )({})
  assert.deepStrictEqual(subst, undefined)
}

test("matchSexp -- var", () => {
  assertMatch("x", "1", { x: S.IntSexp(BigInt(1), S.zeroLocation("[test]")) })
  assertMatch("x", "hi", { x: S.SymbolSexp("hi", S.zeroLocation("[test]")) })
})

test("matchSexp -- int float", () => {
  assertMatch("1", "1", {})
  assertMatch("3.14", "3.14", {})

  assertMatchFail("1", "2")
  assertMatchFail("3.14", "3.1415")
})

test("matchSexp -- list", () => {
  assertMatch("[x y z]", "(1 2 3)", {
    x: S.IntSexp(BigInt(1), S.zeroLocation("[test]")),
    y: S.IntSexp(BigInt(2), S.zeroLocation("[test]")),
    z: S.IntSexp(BigInt(3), S.zeroLocation("[test]")),
  })

  assertMatch("[x [y] z]", "(1 (2) 3)", {
    x: S.IntSexp(BigInt(1), S.zeroLocation("[test]")),
    y: S.IntSexp(BigInt(2), S.zeroLocation("[test]")),
    z: S.IntSexp(BigInt(3), S.zeroLocation("[test]")),
  })

  assertMatchFail("[x y x]", "(1 2 3)")
  assertMatchFail("[x 0 z]", "(1 2 3)")
})

test("matchSexp -- quote", () => {
  assertMatch("'x", "x", {})
  assertMatch("(@quote x)", "x", {})
  assertMatch("(@quote 3)", "3", {})

  assertMatch("['lambda [x] x]", "(lambda (x) x)", {
    x: S.SymbolSexp("x", S.zeroLocation("[test]")),
  })
  assertMatch("'(lambda (x) x)", "(lambda (x) x)", {})
})

test("matchSexp -- quasiquote", () => {
  assertMatch("`x", "x", {})
  assertMatch("`(lambda (,x) ,x)", "(lambda (x) x)", {
    x: S.SymbolSexp("x", S.zeroLocation("[test]")),
  })
  assertMatch("`(lambda (,name) ,ret)", "(lambda (x) x)", {
    name: S.SymbolSexp("x", S.zeroLocation("[test]")),
    ret: S.SymbolSexp("x", S.zeroLocation("[test]")),
  })
  assertMatch("`(,target ,arg)", "(f x)", {
    target: S.SymbolSexp("f", S.zeroLocation("[test]")),
    arg: S.SymbolSexp("x", S.zeroLocation("[test]")),
  })
})

test("matchSexp -- cons", () => {
  assertMatch("(cons head tail)", "(f x y)", {
    head: S.SymbolSexp("f", S.zeroLocation("[test]")),
    tail: S.ListSexp(
      [
        S.SymbolSexp("x", S.zeroLocation("[test]")),
        S.SymbolSexp("y", S.zeroLocation("[test]")),
      ],
      S.zeroLocation("[test]"),
    ),
  })
})

test("matchSexp -- cons*", () => {
  assertMatch("(cons* head next tail)", "(f x y)", {
    head: S.SymbolSexp("f", S.zeroLocation("[test]")),
    next: S.SymbolSexp("x", S.zeroLocation("[test]")),
    tail: S.ListSexp(
      [S.SymbolSexp("y", S.zeroLocation("[test]"))],
      S.zeroLocation("[test]"),
    ),
  })
})
