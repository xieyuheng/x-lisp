import assert from "node:assert"
import { test } from "node:test"
import { matchSexp, type Subst } from "../match/index.ts"
import { parseSexp } from "../parser/index.ts"
import * as S from "../sexp/index.ts"

const testOptions = { path: "[matchSexp.test]" }

function assertMatch(
  patternInput: string,
  sexpInput: string | S.Sexp,
  expectedSubst: Subst,
): void {
  const pattern = parseSexp(patternInput, testOptions)
  const sexp =
    typeof sexpInput === "string"
      ? parseSexp(sexpInput, testOptions)
      : sexpInput
  const subst = matchSexp("NormalMode", pattern, sexp)({})
  assert(subst)
  assert(S.sexpEqualRecord(subst, expectedSubst))
}

function assertMatchFail(patternInput: string, sexpInput: string): void {
  const subst = matchSexp(
    "NormalMode",
    parseSexp(patternInput, testOptions),
    parseSexp(sexpInput, testOptions),
  )({})
  assert.deepStrictEqual(subst, undefined)
}

test("matchSexp -- var", () => {
  assertMatch("x", "1", { x: S.Int(BigInt(1)) })
  assertMatch("x", "hi", { x: S.Symbol("hi") })
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
    x: S.Int(BigInt(1)),
    y: S.Int(BigInt(2)),
    z: S.Int(BigInt(3)),
  })

  assertMatch("[x [y] z]", "(1 (2) 3)", {
    x: S.Int(BigInt(1)),
    y: S.Int(BigInt(2)),
    z: S.Int(BigInt(3)),
  })

  assertMatchFail("[x y x]", "(1 2 3)")
  assertMatchFail("[x 0 z]", "(1 2 3)")
})

test("matchSexp -- quote", () => {
  assertMatch("'x", "x", {})
  assertMatch("(@quote x)", "x", {})
  assertMatch("(@quote 3)", "3", {})

  assertMatch("['lambda [x] x]", "(lambda (x) x)", { x: S.Symbol("x") })
  assertMatch("'(lambda (x) x)", "(lambda (x) x)", {})
})

test("matchSexp -- quasiquote", () => {
  assertMatch("`x", "x", {})
  assertMatch("`(lambda (,x) ,x)", "(lambda (x) x)", { x: S.Symbol("x") })
  assertMatch("`(lambda (,name) ,ret)", "(lambda (x) x)", {
    name: S.Symbol("x"),
    ret: S.Symbol("x"),
  })
  assertMatch("`(,target ,arg)", "(f x)", {
    target: S.Symbol("f"),
    arg: S.Symbol("x"),
  })
})

test("matchSexp -- cons", () => {
  assertMatch("(cons head tail)", "(f x y)", {
    head: S.Symbol("f"),
    tail: S.List([S.Symbol("x"), S.Symbol("y")]),
  })
})

test("matchSexp -- cons*", () => {
  assertMatch("(cons* head next tail)", "(f x y)", {
    head: S.Symbol("f"),
    next: S.Symbol("x"),
    tail: S.List([S.Symbol("y")]),
  })
})
