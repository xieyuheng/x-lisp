import assert from "node:assert"
import { test } from "node:test"
import { Lexer } from "../lexer/index.ts"
import { type Token } from "../token/index.ts"

function assertTokens(text: string, tokens: Array<Omit<Token, "meta">>): void {
  const lexer = new Lexer()
  const results = lexer.lex(text).map(({ kind, value }) => ({ kind, value }))
  assert.deepStrictEqual(results, tokens)
}

test("lexer -- blank", () => {
  assertTokens("", [])
  assertTokens("\n", [])
  assertTokens(" \n ", [])
  assertTokens(" \n \t ", [])
  assertTokens("    ", [])
})

test("lexer -- symbol", () => {
  assertTokens("a b c", [
    { kind: "Symbol", value: "a" },
    { kind: "Symbol", value: "b" },
    { kind: "Symbol", value: "c" },
  ])

  assertTokens("abc", [{ kind: "Symbol", value: "abc" }])

  assertTokens("3-sphere", [{ kind: "Symbol", value: "3-sphere" }])
})

test("lexer -- quotes", () => {
  assertTokens("'a", [
    { kind: "QuotationMark", value: "'" },
    { kind: "Symbol", value: "a" },
  ])

  assertTokens("'  a", [
    { kind: "QuotationMark", value: "'" },
    { kind: "Symbol", value: "a" },
  ])
})

test("lexer -- brackets", () => {
  assertTokens("()", [
    { kind: "BracketStart", value: "(" },
    { kind: "BracketEnd", value: ")" },
  ])

  assertTokens("( )", [
    { kind: "BracketStart", value: "(" },
    { kind: "BracketEnd", value: ")" },
  ])

  assertTokens("(a)(b)", [
    { kind: "BracketStart", value: "(" },
    { kind: "Symbol", value: "a" },
    { kind: "BracketEnd", value: ")" },
    { kind: "BracketStart", value: "(" },
    { kind: "Symbol", value: "b" },
    { kind: "BracketEnd", value: ")" },
  ])

  assertTokens("([x])", [
    { kind: "BracketStart", value: "(" },
    { kind: "BracketStart", value: "[" },
    { kind: "Symbol", value: "x" },
    { kind: "BracketEnd", value: "]" },
    { kind: "BracketEnd", value: ")" },
  ])

  assertTokens("(head . tail)", [
    { kind: "BracketStart", value: "(" },
    { kind: "Symbol", value: "head" },
    { kind: "Symbol", value: "." },
    { kind: "Symbol", value: "tail" },
    { kind: "BracketEnd", value: ")" },
  ])

  assertTokens("abc", [{ kind: "Symbol", value: "abc" }])
})

test("lexer -- comments", () => {
  assertTokens("; abc", [])
  assertTokens("; abc\n", [])
  assertTokens("; abc\nabc", [{ kind: "Symbol", value: "abc" }])
})

test("lexer -- keyword", () => {
  assertTokens(":abc", [{ kind: "Keyword", value: "abc" }])
})

test("lexer -- string", () => {
  assertTokens('"abc"', [{ kind: "DoubleQoutedString", value: "abc" }])

  assertTokens('"abc" "abc"', [
    { kind: "DoubleQoutedString", value: "abc" },
    { kind: "DoubleQoutedString", value: "abc" },
  ])

  assertTokens('"abc""abc"', [
    { kind: "DoubleQoutedString", value: "abc" },
    { kind: "DoubleQoutedString", value: "abc" },
  ])

  assertTokens('";;"', [{ kind: "DoubleQoutedString", value: ";;" }])
})

test("lexer -- number", () => {
  assertTokens("1", [{ kind: "Number", value: "1" }])
  assertTokens("-1", [{ kind: "Number", value: "-1" }])

  assertTokens("3.14 3.14", [
    { kind: "Number", value: "3.14" },
    { kind: "Number", value: "3.14" },
  ])
})
