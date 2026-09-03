import assert from "node:assert/strict"
import { test } from "node:test"
import * as S from "@xieyuheng/sexp.js"
import { formatOperand } from "../format/formatOperand.ts"
import { parseOperand } from "./parseOperand.ts"

test("parseOperand / formatOperand: u16 operand", () => {
  const sexp = S.parseSexp("(u16 1)", { path: "test" })
  const operand = parseOperand(sexp)

  assert.equal(operand.kind, "U16Operand")
  if (operand.kind === "U16Operand") {
    assert.equal(operand.content, 1)
  }

  assert.equal(formatOperand(operand), "(u16 1)")
})