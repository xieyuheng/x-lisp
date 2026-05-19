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
  assertMatch("x", "1", { x: S.Int(BigInt(1), S.zeroLocation()) })
  assertMatch("x", "hi", { x: S.Symbol("hi", S.zeroLocation()) })
})

test("matchSexp -- bool int float", () => {
  assertMatch(":f", ":f", {})
  assertMatch("1", "1", {})
  assertMatch("3.14", "3.14", {})

  assertMatchFail(":f", ":t")
  assertMatchFail("1", "2")
  assertMatchFail("3.14", "3.1415")
})

test("matchSexp -- list", () => {
  assertMatch("[x y z]", "(1 2 3)", {
    x: S.Int(BigInt(1), S.zeroLocation()),
    y: S.Int(BigInt(2), S.zeroLocation()),
    z: S.Int(BigInt(3), S.zeroLocation()),
  })

  assertMatch("[x [y] z]", "(1 (2) 3)", {
    x: S.Int(BigInt(1), S.zeroLocation()),
    y: S.Int(BigInt(2), S.zeroLocation()),
    z: S.Int(BigInt(3), S.zeroLocation()),
  })

  assertMatchFail("[x y x]", "(1 2 3)")
  assertMatchFail("[x 0 z]", "(1 2 3)")
})

test("matchSexp -- quote", () => {
  assertMatch("'x", "x", {})
  assertMatch("(@quote x)", "x", {})
  assertMatch("(@quote 3)", "3", {})

  assertMatch("['lambda [x] x]", "(lambda (x) x)", {
    x: S.Symbol("x", S.zeroLocation()),
  })
  assertMatch("'(lambda (x) x)", "(lambda (x) x)", {})
})

test("matchSexp -- quasiquote", () => {
  assertMatch("`x", "x", {})
  assertMatch("`(lambda (,x) ,x)", "(lambda (x) x)", {
    x: S.Symbol("x", S.zeroLocation()),
  })
  assertMatch("`(lambda (,name) ,ret)", "(lambda (x) x)", {
    name: S.Symbol("x", S.zeroLocation()),
    ret: S.Symbol("x", S.zeroLocation()),
  })
  assertMatch("`(,target ,arg)", "(f x)", {
    target: S.Symbol("f", S.zeroLocation()),
    arg: S.Symbol("x", S.zeroLocation()),
  })
})

test("matchSexp -- cons", () => {
  assertMatch("(cons head tail)", "(f x y)", {
    head: S.Symbol("f", S.zeroLocation()),
    tail: S.List(
      [S.Symbol("x", S.zeroLocation()), S.Symbol("y", S.zeroLocation())],
      S.zeroLocation(),
    ),
  })
})

test("matchSexp -- cons*", () => {
  assertMatch("(cons* head next tail)", "(f x y)", {
    head: S.Symbol("f", S.zeroLocation()),
    next: S.Symbol("x", S.zeroLocation()),
    tail: S.List([S.Symbol("y", S.zeroLocation())], S.zeroLocation()),
  })
})
