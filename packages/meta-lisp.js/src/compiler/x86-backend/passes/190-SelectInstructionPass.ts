import * as B from "@xieyuheng/basic-lisp.js"
import * as M from "../../../meta/index.ts"
import * as X86 from "@xieyuheng/x86-lisp.js"

// translate basic-lisp to x86-lisp (with variables)

export function SelectInstructionPass(
  pkg: M.Package,
  basicProgram: B.Program,
  ssaReport: B.SsaAnalysisReport,
): X86.Program {
  const x86Program = X86.createProgram()
  const stmts = Array.from(basicProgram.definitions.values()).flatMap(
    (definition) => selectDefinition(definition, basicProgram, ssaReport),
  )
  X86.BuildPipeline(x86Program, stmts)
  return x86Program
}

function selectDefinition(
  definition: B.Definition,
  basicProgram: B.Program,
  ssaReport: B.SsaAnalysisReport,
): Array<X86.Stmt> {
  switch (definition.kind) {
    case "StructDefinition": {
      // - not supported yet, same as xvm backend.
      return []
    }

    case "FunctionDefinition": {
      const ssaGraph = ssaReport.ssaGraphs.get(definition.name)
      if (ssaGraph === undefined) {
        let message = `[selectDefinition] undefined ssa report: ${definition.name}`
        throw new Error(message)
      }

      const instrs = Array.from(definition.blocks.values()).flatMap((block) =>
        selectBlock(block, basicProgram, ssaGraph),
      )
      return [X86.DefineCodeStmt(definition.name, instrs)]
    }

    case "VariableDefinition": {
      // - a variable is an 8-byte slot in the space segment.
      //   setup-variables stores the ©setup.<name> initial value into it.
      return [X86.DefineSpaceStmt(definition.name, X86.IntData(8n))]
    }

    case "ExternFunctionDefinition": {
      // - no native code; `address` references and calls are emitted
      //   as extern fixups, resolved by the loader.
      return []
    }

    case "ExternVariableDefinition": {
      // - no native code; `address` references are emitted as extern
      //   fixups, resolved by the loader (e.g. true/false/void).
      return []
    }
  }
}

type SelectState = {
  basicProgram: B.Program
  ssaGraph: B.SsaGraph
  icmpMap: Map<string, { cc: string; a: string; b: string }>
}

const argRegs = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"]

const TAG_BITS = 3n
const INT_TAG = 0b000n
const FLOAT_TAG = 0b001n
const IMMEDIATE_TAG = 0b110n
const OBJECT_TAG = 0b111n

// -8n is the signed 64-bit interpretation of ~0b111 (0xfffffffffffffff8).
// x86 `and r64, imm8` sign-extends imm8 to 64 bits, so -8n encodes as
// a compact imm8 instead of a full imm32/imm64.
const PAYLOAD_MASK = -8n

const binaryX86Op: Record<string, string> = {
  iadd: "add",
  isub: "sub",
  and: "and",
  or: "or",
  xor: "xor",
  shl: "shl",
  shr: "shr",
  bitand: "and",
  bitor: "or",
  bitxor: "xor",
}

const commutativeOps = new Set([
  "iadd",
  "imul",
  "and",
  "or",
  "xor",
  "bitand",
  "bitor",
  "bitxor",
])

const cmpCc: Record<string, string> = {
  "icmp-eq": "e",
  "icmp-ne": "ne",
  "icmp-lt": "l",
  "icmp-le": "le",
  "icmp-gt": "g",
  "icmp-ge": "ge",
  "bool-eq": "e",
  "bool-ne": "ne",
  "pointer-eq": "e",
  "pointer-ne": "ne",
  "value-eq": "e",
  "value-ne": "ne",
}

function cellToVar(cell: B.Cell): X86.VarOperand {
  return X86.VarOperand(cell.id)
}

function setupArgs(argCells: Array<B.Cell>): Array<X86.Instr> {
  return argCells.map((cell, i) =>
    X86.Instr("mov", [X86.RegOperand(argRegs[i]), cellToVar(cell)]),
  )
}

function selectBinaryOp(instr: B.Instr): Array<X86.Instr> {
  const x86op = binaryX86Op[instr.op]
  const [a, b] = instr.input
  const [out] = instr.output

  if (commutativeOps.has(instr.op) && out.id === b.id) {
    return [X86.Instr(x86op, [cellToVar(out), cellToVar(a)])]
  }

  return [
    X86.Instr("mov", [cellToVar(out), cellToVar(a)]),
    X86.Instr(x86op, [cellToVar(out), cellToVar(b)]),
  ]
}

// - iadd/isub operate directly on tagged values: (a<<3)±(b<<3)=(a±b)<<3.
// - imul/idiv/imod must untag first: (a<<3)*(b<<3)=(a*b)<<6, which is wrong.
// - ineg: 0 - a on tagged values.

function selectIntArith(instr: B.Instr): Array<X86.Instr> {
  const [out] = instr.output

  if (instr.op === "imul") {
    const [a, b] = instr.input
    return [
      X86.Instr("mov", [X86.RegOperand("rax"), cellToVar(a)]),
      X86.Instr("sar", [X86.RegOperand("rax"), X86.ImmOperand(TAG_BITS)]),
      X86.Instr("mov", [X86.RegOperand("rdx"), cellToVar(b)]),
      X86.Instr("sar", [X86.RegOperand("rdx"), X86.ImmOperand(TAG_BITS)]),
      X86.Instr("imul", [X86.RegOperand("rax"), X86.RegOperand("rdx")]),
      X86.Instr("shl", [X86.RegOperand("rax"), X86.ImmOperand(TAG_BITS)]),
      X86.Instr("mov", [cellToVar(out), X86.RegOperand("rax")]),
    ]
  }

  if (instr.op === "ineg") {
    const [a] = instr.input
    return [
      X86.Instr("mov", [X86.RegOperand("rdx"), cellToVar(a)]),
      X86.Instr("mov", [cellToVar(out), X86.ImmOperand(0n)]),
      X86.Instr("sub", [cellToVar(out), X86.RegOperand("rdx")]),
    ]
  }

  if (instr.op === "idiv" || instr.op === "imod") {
    const [a, b] = instr.input
    const takeRemainder = instr.op === "imod"
    return [
      X86.Instr("mov", [X86.RegOperand("rcx"), cellToVar(b)]),
      X86.Instr("sar", [X86.RegOperand("rcx"), X86.ImmOperand(TAG_BITS)]),
      X86.Instr("mov", [X86.RegOperand("rax"), cellToVar(a)]),
      X86.Instr("sar", [X86.RegOperand("rax"), X86.ImmOperand(TAG_BITS)]),
      X86.Instr("cqo", []),
      X86.Instr("idiv", [X86.RegOperand("rcx")]),
      X86.Instr("shl", [
        X86.RegOperand(takeRemainder ? "rdx" : "rax"),
        X86.ImmOperand(TAG_BITS),
      ]),
      X86.Instr("mov", [
        cellToVar(out),
        X86.RegOperand(takeRemainder ? "rdx" : "rax"),
      ]),
    ]
  }

  throw new Error(`[selectIntArith] unhandled op: ${instr.op}`)
}

// - int-is-* predicates return a raw 0/1 bool (cmp + set + movzx).

const intIsCc: Record<string, string> = {
  "int-is-positive": "g",
  "int-is-non-negative": "ge",
  "int-is-non-zero": "ne",
}

function selectIntIs(instr: B.Instr): Array<X86.Instr> {
  const [a] = instr.input
  const [out] = instr.output
  const cc = intIsCc[instr.op]
  return [
    X86.Instr("cmp", [cellToVar(a), X86.ImmOperand(0n)]),
    X86.Instr("set", [X86.CcOperand(cc), X86.RegOperand("al")]),
    X86.Instr("movzx", [cellToVar(out), X86.RegOperand("al")]),
    // - note: booleans are tagged (see icmp), matching extern semantics.
    X86.Instr("shl", [cellToVar(out), X86.ImmOperand(TAG_BITS)]),
    X86.Instr("or", [cellToVar(out), X86.ImmOperand(IMMEDIATE_TAG)]),
  ]
}

function selectBlock(
  basicBlock: B.Block,
  basicProgram: B.Program,
  ssaGraph: B.SsaGraph,
): Array<X86.Instr> {
  const state: SelectState = {
    basicProgram,
    ssaGraph,
    icmpMap: new Map(),
  }
  const instrs = basicBlock.instrs.flatMap((instr) => selectInstr(state, instr))
  return [X86.Instr("label", [X86.LabelOperand(basicBlock.label)]), ...instrs]
}

function selectInstr(state: SelectState, instr: B.Instr): Array<X86.Instr> {
  switch (instr.op) {
    case "argument": {
      const [out] = instr.output
      const index = Number(B.expectInt(instr.attributes, "index"))
      return [
        X86.Instr("mov", [cellToVar(out), X86.RegOperand(argRegs[index])]),
      ]
    }

    case "int64": {
      const [out] = instr.output
      const value = B.expectInt(instr.attributes, "content")
      return [X86.Instr("mov", [cellToVar(out), X86.ImmOperand(value)])]
    }

    case "bool": {
      const [out] = instr.output
      const value = B.expectBool(instr.attributes, "value")
      return [
        X86.Instr("mov", [cellToVar(out), X86.ImmOperand(value ? 1n : 0n)]),
      ]
    }

    case "copy": {
      const [src] = instr.input
      const [out] = instr.output
      return [X86.Instr("mov", [cellToVar(out), cellToVar(src)])]
    }

    case "iadd":
    case "isub":
    case "and":
    case "or":
    case "xor":
    case "shl":
    case "shr":
    case "bitand":
    case "bitor":
    case "bitxor": {
      return selectBinaryOp(instr)
    }

    case "imul":
    case "idiv":
    case "imod":
    case "ineg": {
      return selectIntArith(instr)
    }

    case "int-is-positive":
    case "int-is-non-negative":
    case "int-is-non-zero": {
      return selectIntIs(instr)
    }

    case "not": {
      const [a] = instr.input
      const [out] = instr.output
      return [
        X86.Instr("mov", [cellToVar(out), cellToVar(a)]),
        X86.Instr("xor", [cellToVar(out), X86.ImmOperand(1n)]),
      ]
    }

    case "tag-int": {
      const [a] = instr.input
      const [out] = instr.output
      // - fold `int64 c; tag-int` into a single load of (c << 3).
      if (B.ssaIsDefinedByOp(state.ssaGraph, a.id, "int64")) {
        const definer = B.ssaGetDefiner(state.ssaGraph, a.id)
        const value = B.expectInt(definer.attributes, "content")
        return [
          X86.Instr("mov", [cellToVar(out), X86.ImmOperand(value << TAG_BITS)]),
        ]
      }
      return [
        X86.Instr("mov", [cellToVar(out), cellToVar(a)]),
        X86.Instr("shl", [cellToVar(out), X86.ImmOperand(TAG_BITS)]),
      ]
    }

    case "tag-bool": {
      const [a] = instr.input
      const [out] = instr.output
      return [
        X86.Instr("mov", [cellToVar(out), cellToVar(a)]),
        X86.Instr("shl", [cellToVar(out), X86.ImmOperand(TAG_BITS)]),
        X86.Instr("or", [cellToVar(out), X86.ImmOperand(IMMEDIATE_TAG)]),
      ]
    }

    case "to-int64": {
      const [a] = instr.input
      const [out] = instr.output
      return [
        X86.Instr("mov", [cellToVar(out), cellToVar(a)]),
        X86.Instr("sar", [cellToVar(out), X86.ImmOperand(TAG_BITS)]),
      ]
    }

    case "to-bool": {
      const [a] = instr.input
      const [out] = instr.output
      // - if this to-bool feeds a folded branch (icmpMap), the branch
      //   jumps on the raw comparison directly; the bool value is never
      //   read, so drop the conversion entirely.
      if (state.icmpMap.has(out.id)) {
        return []
      }
      return [
        X86.Instr("mov", [cellToVar(out), cellToVar(a)]),
        X86.Instr("shr", [cellToVar(out), X86.ImmOperand(TAG_BITS)]),
      ]
    }

    case "icmp-eq":
    case "icmp-ne":
    case "icmp-lt":
    case "icmp-le":
    case "icmp-gt":
    case "icmp-ge":
    case "bool-eq":
    case "bool-ne":
    case "pointer-eq":
    case "pointer-ne":
    case "value-eq":
    case "value-ne": {
      const [a, b] = instr.input
      const [out] = instr.output
      const cc = cmpCc[instr.op]

      const user = B.ssaGetSoleUser(state.ssaGraph, out.id)

      // - fold through a single to-bool: `(if (int-less-or-equal a b) ...)`
      //   lowers straight to `cmp a, b; jcc`, skipping the bool round-trip.
      let branchCondId: string | undefined
      if (user?.op === "branch") {
        branchCondId = out.id
      } else if (user?.op === "to-bool") {
        const [toBoolOut] = user.output
        const user2 = B.ssaGetSoleUser(state.ssaGraph, toBoolOut.id)
        if (user2?.op === "branch") {
          branchCondId = toBoolOut.id
        }
      }

      if (branchCondId !== undefined) {
        state.icmpMap.set(branchCondId, { cc, a: a.id, b: b.id })
        return []
      }

      return [
        X86.Instr("cmp", [cellToVar(a), cellToVar(b)]),
        X86.Instr("set", [X86.CcOperand(cc), X86.RegOperand("al")]),
        X86.Instr("movzx", [cellToVar(out), X86.RegOperand("al")]),
        // - note: booleans are tagged (x_false=0b00110 / x_true=0b01110),
        //   like the extern `true`/`false` variables and to-bool expects.
        X86.Instr("shl", [cellToVar(out), X86.ImmOperand(TAG_BITS)]),
        X86.Instr("or", [cellToVar(out), X86.ImmOperand(IMMEDIATE_TAG)]),
      ]
    }

    case "branch": {
      const [cond] = instr.input
      const thenLabel = B.expectSymbol(instr.attributes, "then-label")
      const elseLabel = B.expectSymbol(instr.attributes, "else-label")

      const icmp = state.icmpMap.get(cond.id)
      if (icmp) {
        return [
          X86.Instr("cmp", [X86.VarOperand(icmp.a), X86.VarOperand(icmp.b)]),
          X86.Instr("j", [X86.CcOperand(icmp.cc), X86.LabelOperand(thenLabel)]),
          X86.Instr("jmp", [X86.LabelOperand(elseLabel)]),
        ]
      }

      return [
        X86.Instr("cmp", [cellToVar(cond), X86.ImmOperand(1n)]),
        X86.Instr("j", [X86.CcOperand("e"), X86.LabelOperand(thenLabel)]),
        X86.Instr("jmp", [X86.LabelOperand(elseLabel)]),
      ]
    }

    case "return": {
      const [val] = instr.input
      if (val) {
        return [
          X86.Instr("mov", [X86.RegOperand("rax"), cellToVar(val)]),
          X86.Instr("jmp", [X86.LabelOperand("epilog")]),
        ]
      }
      return [X86.Instr("jmp", [X86.LabelOperand("epilog")])]
    }

    case "goto": {
      const label = B.expectSymbol(instr.attributes, "label")
      return [X86.Instr("jmp", [X86.LabelOperand(label)])]
    }

    case "provide": {
      const [val] = instr.input
      const site = B.expectSymbol(instr.attributes, "use-site")
      return [X86.Instr("mov", [X86.VarOperand(site), cellToVar(val)])]
    }

    case "use": {
      return []
    }

    case "address": {
      const [out] = instr.output
      const name = B.expectSymbol(instr.attributes, "name")
      const definition = B.programLookupDefinition(state.basicProgram, name)
      const isExtern =
        definition?.kind === "ExternFunctionDefinition" ||
        definition?.kind === "ExternVariableDefinition"
      const operand = isExtern
        ? X86.ExternOperand(name)
        : X86.AddressOperand(name)
      return [X86.Instr("mov", [cellToVar(out), operand])]
    }

    case "symbol-value": {
      const [out] = instr.output
      const content = B.expectSymbol(instr.attributes, "content")
      return [
        X86.Instr("mov", [
          cellToVar(out),
          X86.FixupOperand("symbol-value", content),
        ]),
      ]
    }

    case "symbol": {
      const [out] = instr.output
      const content = B.expectSymbol(instr.attributes, "content")
      return [
        X86.Instr("mov", [cellToVar(out), X86.FixupOperand("symbol", content)]),
      ]
    }

    case "text-value": {
      const [out] = instr.output
      const content = B.expectString(instr.attributes, "content")
      return [
        X86.Instr("mov", [
          cellToVar(out),
          X86.FixupOperand("text-value", content),
        ]),
      ]
    }

    case "string": {
      const [out] = instr.output
      const content = B.expectString(instr.attributes, "content")
      return [
        X86.Instr("mov", [cellToVar(out), X86.FixupOperand("string", content)]),
      ]
    }

    case "load": {
      const [ptr] = instr.input
      const [out] = instr.output
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), X86.VarOperand(ptr.id)]),
        X86.Instr("mov", [
          cellToVar(out),
          X86.RegMemOperand("qword", "rax", undefined, undefined, undefined),
        ]),
      ]
    }

    case "store": {
      const [ptr, val] = instr.input
      // - note: must not emit `mov [rax], val` (two memory operands) because
      //   PatchInstructionsPass would route val through rax and overwrite the
      //   ptr base address. Use rdx for val explicitly.
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), X86.VarOperand(ptr.id)]),
        X86.Instr("mov", [X86.RegOperand("rdx"), cellToVar(val)]),
        X86.Instr("mov", [
          X86.RegMemOperand("qword", "rax", undefined, undefined, undefined),
          X86.RegOperand("rdx"),
        ]),
      ]
    }

    case "call": {
      const [targetCell, ...argCells] = instr.input
      const [out] = instr.output

      if (B.ssaIsDefinedByOp(state.ssaGraph, targetCell.id, "address")) {
        const definer = B.ssaGetDefiner(state.ssaGraph, targetCell.id)
        const name = B.expectSymbol(definer.attributes, "name")
        const definition = B.programLookupDefinition(state.basicProgram, name)
        const isExtern = definition?.kind === "ExternFunctionDefinition"
        const target = isExtern
          ? X86.ExternOperand(name)
          : X86.LabelOperand(name)
        return [
          ...setupArgs(argCells),
          X86.Instr("call", [target]),
          X86.Instr("mov", [cellToVar(out), X86.RegOperand("rax")]),
        ]
      }

      return [
        X86.Instr("mov", [X86.RegOperand("rax"), cellToVar(targetCell)]),
        ...setupArgs(argCells),
        X86.Instr("call", [
          X86.RegMemOperand("qword", "rax", undefined, undefined, undefined),
        ]),
        X86.Instr("mov", [cellToVar(out), X86.RegOperand("rax")]),
      ]
    }

    case "tail-call": {
      const [targetCell, ...argCells] = instr.input

      if (B.ssaIsDefinedByOp(state.ssaGraph, targetCell.id, "address")) {
        const definer = B.ssaGetDefiner(state.ssaGraph, targetCell.id)
        const name = B.expectSymbol(definer.attributes, "name")
        const definition = B.programLookupDefinition(state.basicProgram, name)
        const isExtern = definition?.kind === "ExternFunctionDefinition"
        const target = isExtern
          ? X86.ExternOperand(name)
          : X86.LabelOperand(name)
        return [...setupArgs(argCells), X86.Instr("tail-jmp", [target])]
      }

      return [
        X86.Instr("mov", [X86.RegOperand("rax"), cellToVar(targetCell)]),
        ...setupArgs(argCells),
        X86.Instr("tail-jmp", [
          X86.RegMemOperand("qword", "rax", undefined, undefined, undefined),
        ]),
      ]
    }

    case "float64": {
      const [out] = instr.output
      const content = B.expectFloat(instr.attributes, "content")
      return [X86.Instr("mov", [cellToVar(out), X86.FloatOperand(content)])]
    }

    case "tag-float": {
      const [x] = instr.input
      const [out] = instr.output
      return [
        X86.Instr("mov", [cellToVar(out), cellToVar(x)]),
        X86.Instr("and", [cellToVar(out), X86.ImmOperand(PAYLOAD_MASK)]),
        X86.Instr("or", [cellToVar(out), X86.ImmOperand(FLOAT_TAG)]),
      ]
    }

    default: {
      let message = `[selectInstr] unhandled instr: ${B.formatInstr(instr)}`
      console.log(message)
      return []
    }
  }
}
