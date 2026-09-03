import { type Instr } from "../instr/Instr.ts"

export type OperandSpec =
  | "var"
  | "dest"
  | "src"
  | "arg"
  | "cond"
  | "closure"
  | "target"
  | "int"
  | "float"
  | "index"
  | "size"
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
  "move": { opcode: 0x01, operands: ["dest", "src"] },
  "load-int": { opcode: 0x02, operands: ["dest", "int"] },
  "load-float": { opcode: 0x03, operands: ["dest", "float"] },
  "load-string": { opcode: 0x04, operands: ["dest", "string"] },
  "load-symbol": { opcode: 0x05, operands: ["dest", "symbol"] },
  "load-closure": { opcode: 0x06, operands: ["dest", "fn"] },
  "make-closure": { opcode: 0x07, operands: ["dest", "fn", "size"] },
  "store-closure-arg": { opcode: 0x08, operands: ["closure", "index", "src"] },
  "load-result": { opcode: 0x09, operands: ["dest"] },
  "load-global": { opcode: 0x0a, operands: ["dest", "global"] },
  "store-global": { opcode: 0x0b, operands: ["global", "src"] },
  "call-0": { opcode: 0x10, operands: ["fn"] },
  "call-1": { opcode: 0x11, operands: ["fn", "arg"] },
  "call-2": { opcode: 0x12, operands: ["fn", "arg", "arg"] },
  "call-3": { opcode: 0x13, operands: ["fn", "arg", "arg", "arg"] },
  "call-4": { opcode: 0x14, operands: ["fn", "arg", "arg", "arg", "arg"] },
  "call-5": { opcode: 0x15, operands: ["fn", "arg", "arg", "arg", "arg", "arg"] },
  "call-6": { opcode: 0x16, operands: ["fn", "arg", "arg", "arg", "arg", "arg", "arg"] },
  "call-prim-0": { opcode: 0x17, operands: ["prim"] },
  "call-prim-1": { opcode: 0x18, operands: ["prim", "arg"] },
  "call-prim-2": { opcode: 0x19, operands: ["prim", "arg", "arg"] },
  "call-prim-3": { opcode: 0x1a, operands: ["prim", "arg", "arg", "arg"] },
  "call-prim-4": { opcode: 0x1b, operands: ["prim", "arg", "arg", "arg", "arg"] },
  "call-prim-5": { opcode: 0x1c, operands: ["prim", "arg", "arg", "arg", "arg", "arg"] },
  "call-prim-6": { opcode: 0x1d, operands: ["prim", "arg", "arg", "arg", "arg", "arg", "arg"] },
  "tail-call-0": { opcode: 0x1e, operands: ["fn"] },
  "tail-call-1": { opcode: 0x1f, operands: ["fn", "arg"] },
  "tail-call-2": { opcode: 0x20, operands: ["fn", "arg", "arg"] },
  "tail-call-3": { opcode: 0x21, operands: ["fn", "arg", "arg", "arg"] },
  "tail-call-4": { opcode: 0x22, operands: ["fn", "arg", "arg", "arg", "arg"] },
  "tail-call-5": { opcode: 0x23, operands: ["fn", "arg", "arg", "arg", "arg", "arg"] },
  "tail-call-6": { opcode: 0x24, operands: ["fn", "arg", "arg", "arg", "arg", "arg", "arg"] },
  "tail-call-prim-0": { opcode: 0x25, operands: ["prim"] },
  "tail-call-prim-1": { opcode: 0x26, operands: ["prim", "arg"] },
  "tail-call-prim-2": { opcode: 0x27, operands: ["prim", "arg", "arg"] },
  "tail-call-prim-3": { opcode: 0x28, operands: ["prim", "arg", "arg", "arg"] },
  "tail-call-prim-4": { opcode: 0x29, operands: ["prim", "arg", "arg", "arg", "arg"] },
  "tail-call-prim-5": { opcode: 0x2a, operands: ["prim", "arg", "arg", "arg", "arg", "arg"] },
  "tail-call-prim-6": { opcode: 0x2b, operands: ["prim", "arg", "arg", "arg", "arg", "arg", "arg"] },
  "apply-0": { opcode: 0x2c, operands: ["target"] },
  "apply-1": { opcode: 0x2d, operands: ["target", "arg"] },
  "apply-2": { opcode: 0x2e, operands: ["target", "arg", "arg"] },
  "apply-3": { opcode: 0x2f, operands: ["target", "arg", "arg", "arg"] },
  "apply-4": { opcode: 0x30, operands: ["target", "arg", "arg", "arg", "arg"] },
  "apply-5": { opcode: 0x31, operands: ["target", "arg", "arg", "arg", "arg", "arg"] },
  "apply-6": { opcode: 0x32, operands: ["target", "arg", "arg", "arg", "arg", "arg", "arg"] },
  "tail-apply-0": { opcode: 0x33, operands: ["target"] },
  "tail-apply-1": { opcode: 0x34, operands: ["target", "arg"] },
  "tail-apply-2": { opcode: 0x35, operands: ["target", "arg", "arg"] },
  "tail-apply-3": { opcode: 0x36, operands: ["target", "arg", "arg", "arg"] },
  "tail-apply-4": { opcode: 0x37, operands: ["target", "arg", "arg", "arg", "arg"] },
  "tail-apply-5": { opcode: 0x38, operands: ["target", "arg", "arg", "arg", "arg", "arg"] },
  "tail-apply-6": { opcode: 0x39, operands: ["target", "arg", "arg", "arg", "arg", "arg", "arg"] },
  "goto": { opcode: 0x40, operands: ["label"] },
  "branch": { opcode: 0x41, operands: ["cond", "label", "label"] },
  "return": { opcode: 0x42, operands: ["src"] },
  "return-void": { opcode: 0x43, operands: [] },
  "iadd": { opcode: 0x50, operands: ["dest", "src", "src"] },
  "isub": { opcode: 0x51, operands: ["dest", "src", "src"] },
  "imul": { opcode: 0x52, operands: ["dest", "src", "src"] },
  "idiv": { opcode: 0x53, operands: ["dest", "src", "src"] },
  "imod": { opcode: 0x54, operands: ["dest", "src", "src"] },
  "ineg": { opcode: 0x55, operands: ["dest", "src"] },
  "int-greater": { opcode: 0x58, operands: ["dest", "src", "src"] },
  "int-less": { opcode: 0x59, operands: ["dest", "src", "src"] },
  "int-greater-or-equal": { opcode: 0x5a, operands: ["dest", "src", "src"] },
  "int-less-or-equal": { opcode: 0x5b, operands: ["dest", "src", "src"] },
  "int-is-positive": { opcode: 0x5c, operands: ["dest", "src"] },
  "int-is-non-negative": { opcode: 0x5d, operands: ["dest", "src"] },
  "int-is-non-zero": { opcode: 0x5e, operands: ["dest", "src"] },
  "fadd": { opcode: 0x70, operands: ["dest", "src", "src"] },
  "fsub": { opcode: 0x71, operands: ["dest", "src", "src"] },
  "fmul": { opcode: 0x72, operands: ["dest", "src", "src"] },
  "fdiv": { opcode: 0x73, operands: ["dest", "src", "src"] },
  "fneg": { opcode: 0x74, operands: ["dest", "src"] },
  "float-greater": { opcode: 0x78, operands: ["dest", "src", "src"] },
  "float-less": { opcode: 0x79, operands: ["dest", "src", "src"] },
  "float-greater-or-equal": { opcode: 0x7a, operands: ["dest", "src", "src"] },
  "float-less-or-equal": { opcode: 0x7b, operands: ["dest", "src", "src"] },
  "float-is-positive": { opcode: 0x7c, operands: ["dest", "src"] },
  "float-is-non-negative": { opcode: 0x7d, operands: ["dest", "src"] },
  "float-is-non-zero": { opcode: 0x7e, operands: ["dest", "src"] },
}

export function instructionSpec(op: string): InstrSpec {
  const spec = InstrSpecs[op]
  if (spec === undefined) {
    throw new Error(`[instructionSpec] unknown op: ${op}`)
  }
  return spec
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
    case "dest":
    case "src":
    case "arg":
    case "cond":
    case "closure":
    case "target":
    case "index":
    case "size": {
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
