import assert from "node:assert"
import { test } from "node:test"
import { matchSexp } from "../match/index.ts"
import { parseSexp } from "../parser/index.ts"
import * as S from "../sexp/index.ts"

function assertMatch(
  patternInput: string,
  sexpInput: string | S.Sexp,
  expectedInput: string,
): void {
  const pattern = parseSexp(patternInput)
  const sexp = typeof sexpInput === "string" ? parseSexp(sexpInput) : sexpInput
  const subst = matchSexp("NormalMode", pattern, sexp)({})
  const expectedSexp = parseSexp(expectedInput)
  assert(subst)
  assert(S.attributesEqual(subst, S.asTael(expectedSexp).attributes))
}

function assertMatchFail(patternInput: string, sexpInput: string): void {
  const subst = matchSexp(
    "NormalMode",
    parseSexp(patternInput),
    parseSexp(sexpInput),
  )({})
  assert.deepStrictEqual(subst, undefined)
}

test("matchSexp -- var", () => {
  assertMatch("x", "1", "[:x 1]")
  assertMatch("x", "hi", "[:x hi]")
})

test("matchSexp -- bool int float", () => {
  assertMatch("#f", "#f", "[]")
  assertMatch("1", "1", "[]")
  assertMatch("3.14", "3.14", "[]")

  assertMatchFail("#f", "#t")
  assertMatchFail("1", "2")
  assertMatchFail("3.14", "3.1415")
})

test("matchSexp -- list", () => {
  assertMatch("[x y z]", "(1 2 3)", "[:x 1 :y 2 :z 3]")
  assertMatch(
    "[x y z :a a :b b]",
    "(1 2 3 :a 10 :b 20)",
    "[:x 1 :y 2 :z 3 :a 10 :b 20]",
  )
  assertMatch("[x [y] z]", "(1 (2) 3)", "[:x 1 :y 2 :z 3]")
  assertMatchFail("[x y x]", "(1 2 3)")
  assertMatchFail("[x 0 z]", "(1 2 3)")
})

test("matchSexp -- quote", () => {
  assertMatch("'x", "x", "[]")
  assertMatch("(@quote x)", "x", "[]")
  assertMatch("(@quote 3)", "3", "[]")

  assertMatch("['lambda [x] x]", "(lambda (x) x)", "[:x x]")
  assertMatch("'(lambda (x) x)", "(lambda (x) x)", "[]")
})

test("matchSexp -- quote record", () => {
  assertMatch("'(:x 1 :y 2)", "(:x 1 :y 2 :z 3)", "[]")
  assertMatchFail("'(:x 1 :y 2)", "(:x 1 :y 3)")
  assertMatchFail("'(:x 1 :y 2 :z 3)", "(:x 1 :y 2)")
  assertMatch(
    "'(:x 1 :y 2 :p (:x 1 :y 2))",
    "(:x 1 :y 2 :z 3 :p (:x 1 :y 2 :z 3))",
    "[]",
  )
})

test("matchSexp -- quasiquote", () => {
  assertMatch("`x", "x", "[]")
  assertMatch("`(lambda (,x) ,x)", "(lambda (x) x)", "[:x x]")
  assertMatch("`(lambda (,name) ,ret)", "(lambda (x) x)", "[:name x :ret x]")
  assertMatch("`(,target ,arg)", "(f x)", "[:target f :arg x]")
})

test("matchSexp -- cons", () => {
  assertMatch("(cons head tail)", "(f x y)", "[:head f :tail (x y)]")
})

test("matchSexp -- cons*", () => {
  assertMatch(
    "(cons* head next tail)",
    "(f x y)",
    "[:head f :next x :tail (y)]",
  )
})
