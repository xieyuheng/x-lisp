import { type Instr } from "../instr/Instr.ts"

export type OperandSpec =
  | "var"
  | "int"
  | "float"
  | "u16"
  | "string"
  | "symbol"
  | "fn"
  | "prim"
  | "global"
  | "label"

export type InstrSpec = {
  opcode: number
  operands: Array<OperandSpec>
}

const InstrSpecs: Record<string, InstrSpec> = {
  "move": { opcode: 0x01, operands: ["var", "var"] },
  "load-int": { opcode: 0x02, operands: ["var", "int"] },
  "load-float": { opcode: 0x03, operands: ["var", "float"] },
  "load-string": { opcode: 0x04, operands: ["var", "string"] },
  "load-symbol": { opcode: 0x05, operands: ["var", "symbol"] },
  "load-closure": { opcode: 0x06, operands: ["var", "fn"] },
  "make-closure": { opcode: 0x07, operands: ["var", "fn", "u16"] },
  "store-closure-arg": { opcode: 0x08, operands: ["var", "u16", "var"] },
  "load-result": { opcode: 0x09, operands: ["var"] },
  "load-global": { opcode: 0x0a, operands: ["var", "global"] },
  "store-global": { opcode: 0x0b, operands: ["global", "var"] },
  "call-0": { opcode: 0x10, operands: ["fn"] },
  "call-1": { opcode: 0x11, operands: ["fn", "var"] },
  "call-2": { opcode: 0x12, operands: ["fn", "var", "var"] },
  "call-3": { opcode: 0x13, operands: ["fn", "var", "var", "var"] },
  "call-4": { opcode: 0x14, operands: ["fn", "var", "var", "var", "var"] },
  "call-5": { opcode: 0x15, operands: ["fn", "var", "var", "var", "var", "var"] },
  "call-6": { opcode: 0x16, operands: ["fn", "var", "var", "var", "var", "var", "var"] },
  "call-prim-0": { opcode: 0x17, operands: ["prim"] },
  "call-prim-1": { opcode: 0x18, operands: ["prim", "var"] },
  "call-prim-2": { opcode: 0x19, operands: ["prim", "var", "var"] },
  "call-prim-3": { opcode: 0x1a, operands: ["prim", "var", "var", "var"] },
  "call-prim-4": { opcode: 0x1b, operands: ["prim", "var", "var", "var", "var"] },
  "call-prim-5": { opcode: 0x1c, operands: ["prim", "var", "var", "var", "var", "var"] },
  "call-prim-6": { opcode: 0x1d, operands: ["prim", "var", "var", "var", "var", "var", "var"] },
  "tail-call-0": { opcode: 0x1e, operands: ["fn"] },
  "tail-call-1": { opcode: 0x1f, operands: ["fn", "var"] },
  "tail-call-2": { opcode: 0x20, operands: ["fn", "var", "var"] },
  "tail-call-3": { opcode: 0x21, operands: ["fn", "var", "var", "var"] },
  "tail-call-4": { opcode: 0x22, operands: ["fn", "var", "var", "var", "var"] },
  "tail-call-5": { opcode: 0x23, operands: ["fn", "var", "var", "var", "var", "var"] },
  "tail-call-6": { opcode: 0x24, operands: ["fn", "var", "var", "var", "var", "var", "var"] },
  "tail-call-prim-0": { opcode: 0x25, operands: ["prim"] },
  "tail-call-prim-1": { opcode: 0x26, operands: ["prim", "var"] },
  "tail-call-prim-2": { opcode: 0x27, operands: ["prim", "var", "var"] },
  "tail-call-prim-3": { opcode: 0x28, operands: ["prim", "var", "var", "var"] },
  "tail-call-prim-4": { opcode: 0x29, operands: ["prim", "var", "var", "var", "var"] },
  "tail-call-prim-5": { opcode: 0x2a, operands: ["prim", "var", "var", "var", "var", "var"] },
  "tail-call-prim-6": { opcode: 0x2b, operands: ["prim", "var", "var", "var", "var", "var", "var"] },
  "apply-0": { opcode: 0x2c, operands: ["var"] },
  "apply-1": { opcode: 0x2d, operands: ["var", "var"] },
  "apply-2": { opcode: 0x2e, operands: ["var", "var", "var"] },
  "apply-3": { opcode: 0x2f, operands: ["var", "var", "var", "var"] },
  "apply-4": { opcode: 0x30, operands: ["var", "var", "var", "var", "var"] },
  "apply-5": { opcode: 0x31, operands: ["var", "var", "var", "var", "var", "var"] },
  "apply-6": { opcode: 0x32, operands: ["var", "var", "var", "var", "var", "var", "var"] },
  "tail-apply-0": { opcode: 0x33, operands: ["var"] },
  "tail-apply-1": { opcode: 0x34, operands: ["var", "var"] },
  "tail-apply-2": { opcode: 0x35, operands: ["var", "var", "var"] },
  "tail-apply-3": { opcode: 0x36, operands: ["var", "var", "var", "var"] },
  "tail-apply-4": { opcode: 0x37, operands: ["var", "var", "var", "var", "var"] },
  "tail-apply-5": { opcode: 0x38, operands: ["var", "var", "var", "var", "var", "var"] },
  "tail-apply-6": { opcode: 0x39, operands: ["var", "var", "var", "var", "var", "var", "var"] },
  "goto": { opcode: 0x40, operands: ["label"] },
  "branch": { opcode: 0x41, operands: ["var", "label", "label"] },
  "return": { opcode: 0x42, operands: ["var"] },
  "return-void": { opcode: 0x43, operands: [] },
  "iadd": { opcode: 0x50, operands: ["var", "var", "var"] },
  "isub": { opcode: 0x51, operands: ["var", "var", "var"] },
  "imul": { opcode: 0x52, operands: ["var", "var", "var"] },
  "idiv": { opcode: 0x53, operands: ["var", "var", "var"] },
  "imod": { opcode: 0x54, operands: ["var", "var", "var"] },
  "ineg": { opcode: 0x55, operands: ["var", "var"] },
  "int-greater": { opcode: 0x58, operands: ["var", "var", "var"] },
  "int-less": { opcode: 0x59, operands: ["var", "var", "var"] },
  "int-greater-or-equal": { opcode: 0x5a, operands: ["var", "var", "var"] },
  "int-less-or-equal": { opcode: 0x5b, operands: ["var", "var", "var"] },
  "int-is-positive": { opcode: 0x5c, operands: ["var", "var"] },
  "int-is-non-negative": { opcode: 0x5d, operands: ["var", "var"] },
  "int-is-non-zero": { opcode: 0x5e, operands: ["var", "var"] },
  "fadd": { opcode: 0x70, operands: ["var", "var", "var"] },
  "fsub": { opcode: 0x71, operands: ["var", "var", "var"] },
  "fmul": { opcode: 0x72, operands: ["var", "var", "var"] },
  "fdiv": { opcode: 0x73, operands: ["var", "var", "var"] },
  "fneg": { opcode: 0x74, operands: ["var", "var"] },
  "float-greater": { opcode: 0x78, operands: ["var", "var", "var"] },
  "float-less": { opcode: 0x79, operands: ["var", "var", "var"] },
  "float-greater-or-equal": { opcode: 0x7a, operands: ["var", "var", "var"] },
  "float-less-or-equal": { opcode: 0x7b, operands: ["var", "var", "var"] },
  "float-is-positive": { opcode: 0x7c, operands: ["var", "var"] },
  "float-is-non-negative": { opcode: 0x7d, operands: ["var", "var"] },
  "float-is-non-zero": { opcode: 0x7e, operands: ["var", "var"] },
}

export function instructionSpec(op: string): InstrSpec {
  const spec = InstrSpecs[op]
  if (spec === undefined) {
    throw new Error(`[instructionSpec] unknown op: ${op}`)
  }
  return spec
}

export function instructionSpecs(): Array<[string, InstrSpec]> {
  return Object.entries(InstrSpecs)
}

export function opcodeFor(op: string): number {
  return instructionSpec(op).opcode
}

export function instructionSize(instr: Instr): number {
  if (instr.op === "label") {
    return 0
  }

  const spec = instructionSpec(instr.op)
  let size = 1
  for (const operand of spec.operands) {
    size += operandSpecSize(operand)
  }
  return size
}

function operandSpecSize(operand: OperandSpec): number {
  switch (operand) {
    case "var":
    case "u16": {
      return 2
    }

    case "int":
    case "float":
    case "string":
    case "symbol":
    case "fn":
    case "prim":
    case "global": {
      return 8
    }

    case "label": {
      return 4
    }
  }
}
