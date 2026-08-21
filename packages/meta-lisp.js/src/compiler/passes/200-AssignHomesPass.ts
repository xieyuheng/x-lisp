import * as X86 from "../../x86/index.ts"

const KNOWN_REGS = new Set([
  "rax",
  "rcx",
  "rdx",
  "rbx",
  "rsp",
  "rbp",
  "rsi",
  "rdi",
  "r8",
  "r9",
  "r10",
  "r11",
  "r12",
  "r13",
  "r14",
  "r15",
])

export type AssignHomesResult = {
  mod: X86.Mod
  homeMap: Map<string, X86.RegMemOperand>
}

export function AssignHomesPass(x86Mod: X86.Mod): AssignHomesResult {
  const newMod: X86.Mod = { definitions: new Map() }

  const allVars = new Set<string>()
  for (const definition of x86Mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") {
      newMod.definitions.set(definition.name, definition)
      continue
    }
    for (const instr of definition.instrs) {
      collectVars(instr, allVars)
    }
  }

  const homeMap = new Map<string, X86.RegMemOperand>()
  let index = 0
  for (const varName of allVars) {
    const offset = -8n * (BigInt(index) + 1n)
    homeMap.set(
      varName,
      X86.RegMemOperand(
        "qword",
        "rbp",
        undefined,
        undefined,
        X86.IntDisplacement(offset),
      ),
    )
    index++
  }

  for (const definition of x86Mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    const newInstrs = definition.instrs.flatMap((instr) =>
      assignInstrHomes(instr, homeMap),
    )
    newMod.definitions.set(
      definition.name,
      X86.CodeDefinition(definition.name, newInstrs),
    )
  }

  return { mod: newMod, homeMap }
}

function isVariableRegMemBase(name: string): boolean {
  return !KNOWN_REGS.has(name)
}

function collectVars(instr: X86.Instr, vars: Set<string>): void {
  for (const op of instr.operands) {
    if (op.kind === "VarOperand") {
      vars.add(op.name)
    }
    if (op.kind === "RegMemOperand") {
      if (op.base !== undefined && isVariableRegMemBase(op.base)) {
        vars.add(op.base)
      }
    }
  }
}

function assignOperand(
  op: X86.Operand,
  homeMap: Map<string, X86.RegMemOperand>,
): X86.Operand {
  if (op.kind === "VarOperand") {
    const home = homeMap.get(op.name)
    if (home === undefined) {
      let message = `[AssignHomesPass] unknown variable: ${op.name}`
      throw new Error(message)
    }
    return home
  }
  return op
}

function assignInstrHomes(
  instr: X86.Instr,
  homeMap: Map<string, X86.RegMemOperand>,
): Array<X86.Instr> {
  const ptrBase = resolveVariableRegMemBase(instr)
  if (ptrBase !== undefined && homeMap.has(ptrBase)) {
    return expandLoadStore(instr, ptrBase, homeMap)
  }

  return [
    X86.Instr(
      instr.op,
      instr.operands.map((op) => assignOperand(op, homeMap)),
    ),
  ]
}

function resolveVariableRegMemBase(instr: X86.Instr): string | undefined {
  for (const op of instr.operands) {
    if (op.kind === "RegMemOperand") {
      if (op.base !== undefined && isVariableRegMemBase(op.base)) {
        return op.base
      }
    }
  }
  return undefined
}

/**
 * Expand load (mov out, [cellBase]) and store (mov [cellBase], val)
 * after the pointer variable cellBase has been spilled to the stack.
 */
function expandLoadStore(
  instr: X86.Instr,
  cellBase: string,
  homeMap: Map<string, X86.RegMemOperand>,
): Array<X86.Instr> {
  const ptrHome = homeMap.get(cellBase)
  if (ptrHome === undefined) {
    let message = `[AssignHomesPass] unknown cell base: ${cellBase}`
    throw new Error(message)
  }

  const [dstOp, srcOp] = instr.operands

  if (srcOp?.kind === "RegMemOperand") {
    const outHome = assignOperand(dstOp, homeMap)
    return [
      X86.Instr("mov", [X86.RegOperand("rax"), ptrHome]),
      X86.Instr("mov", [
        X86.RegOperand("rax"),
        X86.RegMemOperand("qword", "rax", undefined, undefined, undefined),
      ]),
      X86.Instr("mov", [outHome, X86.RegOperand("rax")]),
    ]
  }

  if (dstOp?.kind === "RegMemOperand") {
    const valHome = assignOperand(srcOp, homeMap)
    return [
      X86.Instr("mov", [X86.RegOperand("rax"), ptrHome]),
      X86.Instr("mov", [X86.RegOperand("rcx"), valHome]),
      X86.Instr("mov", [
        X86.RegMemOperand("qword", "rax", undefined, undefined, undefined),
        X86.RegOperand("rcx"),
      ]),
    ]
  }

  let message = `[AssignHomesPass] unexpected load/store pattern`
  throw new Error(message)
}
