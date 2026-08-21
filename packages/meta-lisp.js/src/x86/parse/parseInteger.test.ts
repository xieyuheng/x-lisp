import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert/strict"
import { test } from "node:test"
import { deriveOpSize, operandSize } from "../encode/size.ts"
import { parseInstr } from "./parseInstr.ts"
import { parseOperand } from "./parseOperand.ts"

function parse(text: string): S.Sexp {
  return S.parseSexp(text, { path: "test" })
}

test("parseOperand: hex / bin / oct integers", () => {
  const cases: Array<[string, bigint]> = [
    ["0x61", 97n],
    ["0x7a", 122n],
    ["0X61", 97n],
    ["-0x20", -32n],
    ["0b101", 5n],
    ["0B11110000", 240n],
    ["0o17", 15n],
    ["42", 42n],
    ["-1", -1n],
  ]
  for (const [text, expected] of cases) {
    const op = parseOperand(parse(text))
    assert.equal(op.kind, "ImmOperand", text)
    if (op.kind === "ImmOperand") {
      assert.equal(op.value, expected, text)
    }
  }
})

test("parseOperand: mem with explicit size", () => {
  const op = parseOperand(parse("(mem byte (address buffer))"))
  assert.equal(op.kind, "RipMemOperand")
  if (op.kind === "RipMemOperand") {
    assert.equal(op.size, "byte")
    assert.equal(op.address.name, "buffer")
  }
})

test("parseOperand: mem without size keeps undefined", () => {
  const op = parseOperand(parse("(mem (address buffer))"))
  assert.equal(op.kind, "RipMemOperand")
  if (op.kind === "RipMemOperand") {
    assert.equal(op.size, undefined)
  }
})

test("parseOperand: reg mem with explicit size", () => {
  const op = parseOperand(parse("(mem dword (reg rbp) -8)"))
  assert.equal(op.kind, "RegMemOperand")
  if (op.kind === "RegMemOperand") {
    assert.equal(op.size, "dword")
    assert.equal(op.base, "rbp")
    assert.equal(op.disp?.kind, "IntDisplacement")
  }
})

test("parseOperand: reg mem with index omits scale", () => {
  const op = parseOperand(parse("(mem (reg rbp) (reg rax))"))
  assert.equal(op.kind, "RegMemOperand")
  if (op.kind === "RegMemOperand") {
    assert.equal(op.base, "rbp")
    assert.equal(op.index, "rax")
    assert.equal(op.scale, undefined)
    assert.equal(op.disp, undefined)
  }
})

test("parseOperand: reg mem with index and disp omits scale", () => {
  const op = parseOperand(parse("(mem (reg rbp) (reg rax) -16)"))
  assert.equal(op.kind, "RegMemOperand")
  if (op.kind === "RegMemOperand") {
    assert.equal(op.base, "rbp")
    assert.equal(op.index, "rax")
    assert.equal(op.scale, undefined)
    assert.equal(op.disp?.kind, "IntDisplacement")
    if (op.disp?.kind === "IntDisplacement") {
      assert.equal(op.disp.value, -16n)
    }
  }
})

test("parseOperand: reg mem with scaled index", () => {
  const op = parseOperand(parse("(mem (reg rbp) (* (reg rax) 8))"))
  assert.equal(op.kind, "RegMemOperand")
  if (op.kind === "RegMemOperand") {
    assert.equal(op.base, "rbp")
    assert.equal(op.index, "rax")
    assert.equal(op.scale, 8n)
    assert.equal(op.disp, undefined)
  }
})

test("parseOperand: reg mem with scaled index and disp", () => {
  const op = parseOperand(parse("(mem (reg rbp) (* (reg rax) 8) -16)"))
  assert.equal(op.kind, "RegMemOperand")
  if (op.kind === "RegMemOperand") {
    assert.equal(op.base, "rbp")
    assert.equal(op.index, "rax")
    assert.equal(op.scale, 8n)
    assert.equal(op.disp?.kind, "IntDisplacement")
    if (op.disp?.kind === "IntDisplacement") {
      assert.equal(op.disp.value, -16n)
    }
  }
})

test("deriveOpSize: infer from register when mem omits size", () => {
  const instr = parseInstr(parse("(mov (reg al) (mem (address buffer)))"))
  assert.equal(deriveOpSize(instr), 1)
})

test("deriveOpSize: use explicit mem size", () => {
  const instr = parseInstr(parse("(cmp (mem byte (address buffer)) 0x61)"))
  assert.equal(deriveOpSize(instr), 1)
})

test("deriveOpSize: qword from register pair", () => {
  const instr = parseInstr(parse("(mov (reg rax) (mem (address buffer)))"))
  assert.equal(deriveOpSize(instr), 8)
})

test("deriveOpSize: size mismatch is rejected", () => {
  const instr = parseInstr(parse("(cmp (reg al) (reg ax))"))
  assert.throws(() => deriveOpSize(instr), /mismatch/)
})

test("deriveOpSize: cannot infer without any sized operand", () => {
  const instr = parseInstr(parse("(cmp (mem (address buffer)) 0x61)"))
  assert.throws(() => deriveOpSize(instr), /cannot infer/)
})

test("operandSize: register name gives its size", () => {
  const al = parseOperand(parse("(reg al)"))
  const ax = parseOperand(parse("(reg ax)"))
  const eax = parseOperand(parse("(reg eax)"))
  const rax = parseOperand(parse("(reg rax)"))
  assert.equal(operandSize(al), 1)
  assert.equal(operandSize(ax), 2)
  assert.equal(operandSize(eax), 4)
  assert.equal(operandSize(rax), 8)
})
