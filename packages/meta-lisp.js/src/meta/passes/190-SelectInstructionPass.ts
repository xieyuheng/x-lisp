import * as B from "../../basic2/index.ts"
import * as M from "../../meta/index.ts"
import * as X86 from "../../x86/index.ts"

// translate basic-lisp to assembly-lisp (with variables)

export function SelectInstructionPass(
  pkg: M.Package,
  basicMod: B.Mod,
  ssaReport: M.SsaAnalysisReport,
): X86.Mod {
  const x86Mod = X86.createMod()
  const stmts = Array.from(basicMod.definitions.values()).flatMap(
    (definition) => selectDefinition(definition, ssaReport),
  )
  X86.BuildPipeline(x86Mod, stmts)
  return x86Mod
}

function selectDefinition(
  definition: B.Definition,
  ssaReport: M.SsaAnalysisReport,
): Array<X86.Stmt> {
  switch (definition.kind) {
    case "StructDefinition": {
      // TODO
      return []
    }

    case "FunctionDefinition": {
      const ssaGraph = ssaReport.ssaGraphs.get(definition.name)
      if (ssaGraph === undefined) {
        let message = `[selectDefinition] undefined ssa report: ${definition.name}`
        throw new Error(message)
      }

      const blocks = Array.from(definition.blocks.values()).map((block) =>
        selectBlock(block, ssaGraph),
      )
      return [X86.DefineCodeStmt(definition.name, blocks)]
    }

    case "VariableDefinition": {
      // TODO
      return []
    }

    case "ExternFunctionDefinition": {
      // TODO
      return []
    }

    case "ExternVariableDefinition": {
      // TODO
      return []
    }
  }
}

type SelectState = {
  ssaGraph: B.SsaGraph
  icmpMap: Map<string, { cc: string; a: string; b: string }>
}

const argRegs = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"]

const TAG_BITS = 3n
const INT_TAG = 0b000n
const FLOAT_TAG = 0b001n
const IMMEDIATE_TAG = 0b110n
const OBJECT_TAG = 0b111n

const binaryX86Op: Record<string, string> = {
  iadd: "add",
  isub: "sub",
  imul: "imul",
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

function selectBlock(
  basicBlock: B.Block,
  ssaGraph: B.SsaGraph,
): X86.Block {
  const state: SelectState = {
    ssaGraph,
    icmpMap: new Map(),
  }
  const instrs = basicBlock.instrs.flatMap((instr) => selectInstr(state, instr))
  return X86.Block(basicBlock.label, instrs)
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
    case "imul":
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

      const cellInfo = state.ssaGraph.cellInfos.get(out.id)
      const usedByBranch =
        cellInfo?.usedBy.length === 1 &&
        cellInfo.usedBy[0].instr.op === "branch"

      if (usedByBranch) {
        state.icmpMap.set(out.id, { cc, a: a.id, b: b.id })
        return []
      }

      return [
        X86.Instr("cmp", [cellToVar(a), cellToVar(b)]),
        X86.Instr("set", [X86.CcOperand(cc), X86.RegOperand("al")]),
        X86.Instr("movzx", [cellToVar(out), X86.RegOperand("al")]),
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
          X86.Instr(
            "j",
            [X86.CcOperand(icmp.cc), X86.LabelOperand(thenLabel)],
          ),
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
          X86.Instr("ret", []),
        ]
      }
      return [X86.Instr("ret", [])]
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

    default: {
      let message = `[selectInstr] unhandled instr: ${B.formatInstr(instr)}`
      console.log(message)
      return []
    }
  }
}
