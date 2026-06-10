import type { Instr } from "../../instr/index.ts"
import type { Operand, CcOperand } from "../../operand/index.ts"
import * as X from "./x86/encode.ts"
import type { RelocEntry } from "./x86/encode.ts"

export type EncodedResult = {
  bytes: number[]
  relocs: Array<RelocEntry>
  /** labels defined in this block → offset within this block */
  labels: Map<string, number>
}

export function encodeInstr(instr: Instr): EncodedResult {
  const op = instr.op

  if (op === "label") {
    const operands = instr.operands
    if (operands.length !== 1 || operands[0].kind !== "LabelOperand") {
      throw new Error("label instr must have one LabelOperand")
    }
    return { bytes: [], relocs: [], labels: new Map([[operands[0].name, 0]]) }
  }

  const ops = instr.operands

  switch (op) {
    case "mov": return withLabels(encodeMov(ops))
    case "add": return withLabels(encodeAdd(ops))
    case "sub": return withLabels(encodeSub(ops))
    case "imul": return withLabels(encodeImul(ops))
    case "cmp": return withLabels(encodeCmp(ops))
    case "and": return withLabels(encodeAnd(ops))
    case "or": return withLabels(encodeOr(ops))
    case "xor": return withLabels(encodeXor(ops))
    case "test": return withLabels(encodeTest(ops))
    case "shl": return withLabels(encodeShl(ops))
    case "shr": return withLabels(encodeShr(ops))
    case "push": return withLabels(encodePush(ops))
    case "pop": return withLabels(encodePop(ops))
    case "ret": return withLabels(encodeRet(ops))
    case "call": return withLabels(encodeCall(ops))
    case "jmp": return withLabels(encodeJmp(ops))
    case "j": return withLabels(encodeJCc(ops))
    case "lea": return withLabels(encodeLea(ops))
    default: throw new Error(`unknown op: ${op}`)
  }
}

// ===== private helpers =====

function withLabels(result: X.EncodedOp): EncodedResult {
  return { bytes: result.bytes, relocs: result.relocs, labels: new Map() }
}

function encodeMov(ops: Operand[]): X.EncodedOp {
  return X.encodeMov(ops[0], ops[1])
}

function encodeAdd(ops: Operand[]): X.EncodedOp {
  return X.encodeAdd(ops[0], ops[1])
}

function encodeSub(ops: Operand[]): X.EncodedOp {
  return X.encodeSub(ops[0], ops[1])
}

function encodeImul(ops: Operand[]): X.EncodedOp {
  return X.encodeImul(ops[0], ops[1])
}

function encodeCmp(ops: Operand[]): X.EncodedOp {
  return X.encodeCmp(ops[0], ops[1])
}

function encodeAnd(ops: Operand[]): X.EncodedOp {
  return X.encodeAnd(ops[0], ops[1])
}

function encodeOr(ops: Operand[]): X.EncodedOp {
  return X.encodeOr(ops[0], ops[1])
}

function encodeXor(ops: Operand[]): X.EncodedOp {
  return X.encodeXor(ops[0], ops[1])
}

function encodeTest(ops: Operand[]): X.EncodedOp {
  return X.encodeTest(ops[0], ops[1])
}

function encodeShl(ops: Operand[]): X.EncodedOp {
  return X.encodeShl(ops[0], ops[1])
}

function encodeShr(ops: Operand[]): X.EncodedOp {
  return X.encodeShr(ops[0], ops[1])
}

function encodePush(ops: Operand[]): X.EncodedOp {
  return X.encodePush(ops[0])
}

function encodePop(ops: Operand[]): X.EncodedOp {
  return X.encodePop(ops[0])
}

function encodeRet(_ops: Operand[]): X.EncodedOp {
  return X.encodeRet()
}

function encodeCall(ops: Operand[]): X.EncodedOp {
  const target = ops[0]
  if (target.kind === "LabelOperand") {
    return X.encodeCallRel32(labelReloc(target))
  }
  if (target.kind === "RegDerefOperand") {
    return X.encodeCallMem(target)
  }
  throw new Error(`unsupported call target: ${target.kind}`)
}

function encodeJmp(ops: Operand[]): X.EncodedOp {
  const target = ops[0]
  if (target.kind === "LabelOperand") {
    return X.encodeJmpRel(labelReloc(target))
  }
  throw new Error(`unsupported jmp target: ${target.kind}`)
}

function encodeJCc(ops: Operand[]): X.EncodedOp {
  const cc = ops[0] as CcOperand
  const label = ops[1]
  if (label.kind !== "LabelOperand") throw new Error("j target must be LabelOperand")
  return X.encodeJcc(cc.code, labelReloc(label))
}

function encodeLea(ops: Operand[]): X.EncodedOp {
  return X.encodeLea(ops[0], ops[1])
}

function labelReloc(op: { name: string; path: Array<string> }): X.LabelReloc {
  return { name: op.name, path: op.path, addend: 0 }
}
