import * as S from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../../meta/index.ts"
import * as X86 from "../../x86/index.ts"

const ZERO = S.zeroLocation("")

export function X86CodegenPass(_pkg: M.Package, basicMod: B.Mod): X86.Mod {
  const x86Mod = X86.createMod()

  X86.SubmitPass(x86Mod, [
    X86.DefineStructStmt("gc-map-t", [], [
      { name: "local-count", exp: X86.VarExp("uint16-t", ZERO) },
      { name: "callee-saved-count", exp: X86.VarExp("uint8-t", ZERO) },
      { name: "reserved", exp: X86.VarExp("uint8-t", ZERO) },
    ], ZERO),
    X86.DefineStructStmt("function-metadata-t", [], [
      { name: "arity", exp: X86.VarExp("uint16-t", ZERO) },
      { name: "flags", exp: X86.VarExp("uint16-t", ZERO) },
      { name: "gc-map", exp: X86.VarExp("gc-map-t", ZERO) },
      { name: "name", exp: X86.VarExp("string-t", ZERO) },
    ], ZERO),
  ])

  X86.SubmitPass(x86Mod, [
    X86.ClaimCodeMetadataStmt(X86.VarExp("function-metadata-t", ZERO), ZERO),
  ])
  X86.ClaimPass(x86Mod)

  for (const definition of basicMod.definitions.values()) {
    switch (definition.kind) {
      case "PrimitiveFunctionDeclaration":
      case "PrimitiveVariableDeclaration":
        break
      case "FunctionDefinition": {
        for (const def of codegenFn(x86Mod, basicMod, definition)) {
          X86.modDefine(x86Mod, def)
        }
        break
      }
      case "VariableDefinition": {
        for (const def of codegenVD(x86Mod, basicMod, definition, false)) {
          X86.modDefine(x86Mod, def)
        }
        break
      }
      case "TestDefinition": {
        const vd: B.VariableDefinition = {
          kind: "VariableDefinition",
          mod: definition.mod,
          name: definition.name,
          blocks: definition.blocks,
          location: definition.location,
        }
        for (const def of codegenVD(x86Mod, basicMod, vd, true)) {
          X86.modDefine(x86Mod, def)
        }
        break
      }
    }
  }

  return x86Mod
}

type State = {
  basicMod: B.Mod
  x86Mod: X86.Mod
  argCount: number
  localOffsets: Map<string, number>
  nextLocal: number
}

function makeState(
  basicMod: B.Mod,
  x86Mod: X86.Mod,
  argCount: number,
): State {
  return { basicMod, x86Mod, argCount, localOffsets: new Map(), nextLocal: 2 }
}

function allocLocal(state: State, name: string): number {
  const e = state.localOffsets.get(name)
  if (e !== undefined) return e
  const slot = state.nextLocal
  state.localOffsets.set(name, slot)
  state.nextLocal++
  return slot
}

function allocTemp(state: State): number {
  const slot = state.nextLocal
  state.nextLocal++
  return slot
}

function locSlot(state: State, name: string): number {
  return state.localOffsets.get(name) ?? allocLocal(state, name)
}

function locDisp(slot: number): number {
  return -(8 + slot * 8)
}

function argDisp(index: number): number {
  return 16 + index * 8
}

function rd(reg: string, disp: number): X86.RegDerefOperand {
  return X86.RegDerefOperand(reg, undefined, undefined, BigInt(disp), ZERO)
}
function ro(name: string): X86.RegOperand { return X86.RegOperand(name, ZERO) }
function im(value: number | bigint): X86.ImmOperand { return X86.ImmOperand(BigInt(value), ZERO) }
function lb(name: string): X86.LabelOperand { return X86.LabelOperand(name, [], ZERO) }
function ex(name: string): X86.ExternalLabelOperand { return X86.ExternalLabelOperand(name, ZERO) }
function cc(code: string): X86.CcOperand { return X86.CcOperand(code, ZERO) }
function ii(op: string, ops: Array<X86.Operand>): X86.Instr { return X86.Instr(op, ops, ZERO) }

function codegenFn(
  x86Mod: X86.Mod,
  basicMod: B.Mod,
  def: B.FunctionDefinition,
): Array<X86.Definition> {
  const state = makeState(basicMod, x86Mod, def.parameters.length)
  for (const p of def.parameters) allocLocal(state, p)

  const bodyBlocks: Array<X86.Block> = []
  for (const block of def.blocks.values()) {
    bodyBlocks.push(...compileBlock(state, block))
  }

  const frameBytes = state.nextLocal * 8 + 8

  const prologue: Array<X86.Instr> = [
    ii("push", [ro("rbp")]),
    ii("mov", [ro("rbp"), ro("rsp")]),
    ii("sub", [ro("rsp"), im(frameBytes)]),
    ii("mov", [ro("rax"), X86.LabelImmOperand(lb(`.meta.${def.name}`), ZERO)]),
    ii("mov", [rd("rbp", -8), ro("rax")]),
  ]

  for (let i = 0; i < def.parameters.length; i++) {
    const p = def.parameters[i]
    const slot = state.localOffsets.get(p)
    if (slot !== undefined) {
      prologue.push(
        ii("mov", [ro("rax"), rd("rbp", argDisp(i))]),
        ii("mov", [rd("rbp", locDisp(slot)), ro("rax")]),
      )
    }
  }

  const blocks: Array<X86.Block> = [
    { name: `${def.name}.prologue`, instrs: prologue, location: ZERO },
    ...bodyBlocks,
    {
      name: `${def.name}.epilogue`,
      instrs: [
        ii("mov", [ro("rsp"), ro("rbp")]),
        ii("pop", [ro("rbp")]),
        ii("ret", []),
      ],
      location: ZERO,
    },
  ]

  const codeDef: X86.CodeDefinition = {
    kind: "CodeDefinition",
    name: def.name,
    blocks,
    location: def.location,
  }

  const metaDef: X86.MetadataDefinition = {
    kind: "MetadataDefinition",
    target: def.name,
    fields: [
      { name: "arity", exp: X86.IntExp(BigInt(def.parameters.length), ZERO) },
      { name: "flags", exp: X86.IntExp(0n, ZERO) },
      {
        name: "gc-map",
        exp: X86.StructExp(undefined, [
          { name: "local-count", exp: X86.IntExp(BigInt(state.nextLocal), ZERO) },
          { name: "callee-saved-count", exp: X86.IntExp(0n, ZERO) },
          { name: "reserved", exp: X86.IntExp(0n, ZERO) },
        ], ZERO),
      },
      { name: "name", exp: X86.StringExp(def.name, ZERO) },
    ],
    location: def.location,
  }

  return [codeDef, metaDef]
}

function codegenVD(
  x86Mod: X86.Mod,
  basicMod: B.Mod,
  def: B.VariableDefinition,
  isTest: boolean,
): Array<X86.Definition> {
  const state = makeState(basicMod, x86Mod, 0)

  const bodyBlocks: Array<X86.Block> = []
  for (const block of def.blocks.values()) {
    bodyBlocks.push(...compileBlock(state, block))
  }

  const frameBytes = state.nextLocal * 8 + 8

  const blocks: Array<X86.Block> = [
    {
      name: `${def.name}.prologue`,
      instrs: [
        ii("push", [ro("rbp")]),
        ii("mov", [ro("rbp"), ro("rsp")]),
        ii("sub", [ro("rsp"), im(frameBytes)]),
      ],
      location: ZERO,
    },
    ...bodyBlocks,
    {
      name: `${def.name}.epilogue`,
      instrs: [
        ii("mov", [ro("rax"), im(22)]),
        ii("mov", [ro("rsp"), ro("rbp")]),
        ii("pop", [ro("rbp")]),
        ii("ret", []),
      ],
      location: ZERO,
    },
  ]

  const codeDef: X86.CodeDefinition = {
    kind: "CodeDefinition",
    name: def.name,
    blocks,
    location: def.location,
  }

  const metaDef: X86.MetadataDefinition = {
    kind: "MetadataDefinition",
    target: def.name,
    fields: [
      { name: "arity", exp: X86.IntExp(0n, ZERO) },
      { name: "flags", exp: X86.IntExp(isTest ? 1n : 0n, ZERO) },
      {
        name: "gc-map",
        exp: X86.StructExp(undefined, [
          { name: "local-count", exp: X86.IntExp(BigInt(state.nextLocal), ZERO) },
          { name: "callee-saved-count", exp: X86.IntExp(0n, ZERO) },
          { name: "reserved", exp: X86.IntExp(0n, ZERO) },
        ], ZERO),
      },
      { name: "name", exp: X86.StringExp(def.name, ZERO) },
    ],
    location: def.location,
  }

  return [codeDef, metaDef]
}

function compileBlock(state: State, block: B.Block): Array<X86.Block> {
  const instrs: Array<X86.Instr> = [
    ii("label", [lb(block.label)]),
  ]

  let pendingTest: number | null = null

  for (const instr of block.instrs) {
    if (instr.kind === "TestInstr") {
      const r = compileExp(state, instr.exp)
      instrs.push(...r.instrs)
      pendingTest = r.slot
    } else if (instr.kind === "BranchInstr") {
      if (pendingTest === null) throw new Error("BranchInstr without TestInstr")
      instrs.push(
        ii("cmp", [rd("rbp", locDisp(pendingTest)), im(6)]),
        ii("j", [cc("ne"), lb(instr.thenLabel)]),
        ii("jmp", [lb(instr.elseLabel)]),
      )
      pendingTest = null
    } else {
      instrs.push(...compileInstr(state, instr))
    }
  }

  return [{ name: block.label, instrs, location: ZERO }]
}

function compileInstr(state: State, instr: B.Instr): Array<X86.Instr> {
  switch (instr.kind) {
    case "AssignInstr": {
      const r = compileExp(state, instr.exp)
      const d = locSlot(state, instr.dest)
      if (r.slot !== d) {
        r.instrs.push(
          ii("mov", [ro("rax"), rd("rbp", locDisp(r.slot))]),
          ii("mov", [rd("rbp", locDisp(d)), ro("rax")]),
        )
      }
      return r.instrs
    }
    case "PerformInstr": return compileExp(state, instr.exp).instrs
    case "TestInstr": return compileExp(state, instr.exp).instrs
    case "GotoInstr": return [ii("jmp", [lb(instr.label)])]
    case "ReturnInstr": return compileTail(state, instr.exp)
    case "BranchInstr": throw new Error("[X86CodegenPass] BranchInstr handled in compileBlock")
  }
}

type ExpR = { instrs: Array<X86.Instr>; slot: number }

function compileExp(state: State, exp: B.Exp): ExpR {
  switch (exp.kind) {
    case "IntExp": {
      const s = allocTemp(state)
      return { instrs: [ii("mov", [rd("rbp", locDisp(s)), im(encInt(exp.content))])], slot: s }
    }
    case "FloatExp": {
      const s = allocTemp(state)
      return { instrs: [ii("mov", [rd("rbp", locDisp(s)), im(encFloat(exp.content))])], slot: s }
    }
    case "StringExp": {
      const label = emitVreloc(state, "string", exp.content)
      const s = allocTemp(state)
      return {
        instrs: [
          ii("mov", [ro("rax"), X86.LabelDerefOperand(lb(label), ZERO)]),
          ii("mov", [rd("rbp", locDisp(s)), ro("rax")]),
        ],
        slot: s,
      }
    }
    case "VarExp": return compileVar(state, exp)
    case "ApplyExp": return compileApply(state, exp)
    case "SymbolExp": {
      const label = emitVreloc(state, "symbol", exp.content)
      const s = allocTemp(state)
      return {
        instrs: [
          ii("mov", [ro("rax"), X86.LabelDerefOperand(lb(label), ZERO)]),
          ii("mov", [rd("rbp", locDisp(s)), ro("rax")]),
        ],
        slot: s,
      }
    }
    case "KeywordExp": {
      const label = emitVreloc(state, "keyword", exp.content)
      const s = allocTemp(state)
      return {
        instrs: [
          ii("mov", [ro("rax"), X86.LabelDerefOperand(lb(label), ZERO)]),
          ii("mov", [rd("rbp", locDisp(s)), ro("rax")]),
        ],
        slot: s,
      }
    }
  }
}

function compileTail(state: State, exp: B.Exp): Array<X86.Instr> {
  if (exp.kind === "ApplyExp") return compileTailApply(state, exp)
  const r = compileExp(state, exp)
  r.instrs.push(
    ii("mov", [ro("rax"), rd("rbp", locDisp(r.slot))]),
    ii("mov", [ro("rsp"), ro("rbp")]),
    ii("pop", [ro("rbp")]),
    ii("ret", []),
  )
  return r.instrs
}

function compileVar(state: State, exp: B.VarExp): ExpR {
  const def = B.modLookupDefinition(state.basicMod, exp.name)
  if (!def) {
    const s = locSlot(state, exp.name)
    return { instrs: [], slot: s }
  }

  const label = emitVreloc(state, "definition", def.name)
  const s = allocTemp(state)
  return {
    instrs: [
      ii("mov", [ro("rax"), X86.LabelDerefOperand(lb(label), ZERO)]),
      ii("mov", [rd("rbp", locDisp(s)), ro("rax")]),
    ],
    slot: s,
  }
}
function compileApply(state: State, exp: B.ApplyExp): ExpR {
  return compileGeneralApply(state, exp, false) as ExpR
}

function compileTailApply(state: State, exp: B.ApplyExp): Array<X86.Instr> {
  return compileGeneralApply(state, exp, true) as Array<X86.Instr>
}

function compileGeneralApply(
  state: State,
  exp: B.ApplyExp,
  isTail: boolean,
): ExpR | Array<X86.Instr> {
  const targetName = exp.target.kind === "VarExp" ? exp.target.name : undefined
  const def = targetName ? B.modLookupDefinition(state.basicMod, targetName) : undefined

  const isStaticCall =
    def !== undefined &&
    targetName !== undefined &&
    (def.kind === "PrimitiveFunctionDeclaration" || def.kind === "FunctionDefinition") &&
    exp.args.length === B.definitionArity(def)

  if (isStaticCall) {
    return compileStaticCall(state, targetName, exp.args, isTail,
      def.kind === "PrimitiveFunctionDeclaration")
  }

  if (
    def !== undefined &&
    targetName !== undefined &&
    (def.kind === "PrimitiveFunctionDeclaration" || def.kind === "FunctionDefinition") &&
    exp.args.length < B.definitionArity(def)
  ) {
    const argResults = exp.args.map((a) => compileExp(state, a))
    const refSlot = allocTemp(state)
    const vrelocLabel = emitVreloc(state, "definition", targetName)
    const instrs: Array<X86.Instr> = [
      ...argResults.flatMap((r) => r.instrs),
      ii("mov", [ro("rax"), X86.LabelDerefOperand(lb(vrelocLabel), ZERO)]),
      ii("mov", [rd("rbp", locDisp(refSlot)), ro("rax")]),
    ]
    instrs.push(...emitDynApply(refSlot, argResults.map((r) => r.slot), isTail))
    if (isTail) return instrs
    const dst = allocTemp(state)
    instrs.push(ii("mov", [rd("rbp", locDisp(dst)), ro("rax")]))
    return { instrs, slot: dst }
  }

  if (
    def !== undefined &&
    targetName !== undefined &&
    (def.kind === "PrimitiveFunctionDeclaration" || def.kind === "FunctionDefinition") &&
    exp.args.length > B.definitionArity(def)
  ) {
    const arity = B.definitionArity(def)
    const firstArgs = exp.args.slice(0, arity)
    const restArgs = exp.args.slice(arity)
    const isPrim = def.kind === "PrimitiveFunctionDeclaration"
    const firstResults = firstArgs.map((a) => compileExp(state, a))
    const instrs: Array<X86.Instr> = [...firstResults.flatMap((r) => r.instrs)]

    if (isPrim) {
      const refSlot = allocTemp(state)
      const vrelocLabel = emitVreloc(state, "definition", targetName)
      instrs.push(
        ii("mov", [ro("rax"), X86.LabelDerefOperand(lb(vrelocLabel), ZERO)]),
        ii("mov", [rd("rbp", locDisp(refSlot)), ro("rax")]),
      )
      instrs.push(...emitDynApply(refSlot, firstResults.map((r) => r.slot), false))
    } else {
      for (let i = arity - 1; i >= 0; i--) {
        instrs.push(ii("push", [rd("rbp", locDisp(firstResults[i].slot))]))
      }
      instrs.push(ii("call", [lb(targetName)]))
      instrs.push(ii("add", [ro("rsp"), im(arity * 8)]))
    }

    const tmp = allocTemp(state)
    instrs.push(ii("mov", [rd("rbp", locDisp(tmp)), ro("rax")]))

    const restResults = restArgs.map((a) => compileExp(state, a))
    instrs.push(...restResults.flatMap((r) => r.instrs))

    instrs.push(...emitDynApply(tmp, restResults.map((r) => r.slot), isTail))
    if (isTail) return instrs
    const dst = allocTemp(state)
    instrs.push(ii("mov", [rd("rbp", locDisp(dst)), ro("rax")]))
    return { instrs, slot: dst }
  }

  const argResults = exp.args.map((a) => compileExp(state, a))
  const targetResult = compileExp(state, exp.target)
  const instrs: Array<X86.Instr> = [
    ...argResults.flatMap((r) => r.instrs),
    ...targetResult.instrs,
  ]
  instrs.push(...emitDynApply(targetResult.slot, argResults.map((r) => r.slot), isTail))
  if (isTail) return instrs
  const dst = allocTemp(state)
  instrs.push(ii("mov", [rd("rbp", locDisp(dst)), ro("rax")]))
  return { instrs, slot: dst }
}

function compileStaticCall(
  state: State,
  targetName: string,
  args: Array<B.Exp>,
  isTail: boolean,
  isPrimitive: boolean,
): ExpR | Array<X86.Instr> {
  if (isPrimitive) {
    const argResults = args.map((a) => compileExp(state, a))
    const instrs = argResults.flatMap((r) => r.instrs)
    const refSlot = allocTemp(state)
    const vrelocLabel = emitVreloc(state, "definition", targetName)
    instrs.push(
      ii("mov", [ro("rax"), X86.LabelDerefOperand(lb(vrelocLabel), ZERO)]),
      ii("mov", [rd("rbp", locDisp(refSlot)), ro("rax")]),
    )
    instrs.push(...emitDynApply(refSlot, argResults.map((r) => r.slot), isTail))
    if (isTail) return instrs
    const dst = allocTemp(state)
    instrs.push(ii("mov", [rd("rbp", locDisp(dst)), ro("rax")]))
    return { instrs, slot: dst }
  }

  const argResults = args.map((a) => compileExp(state, a))
  const instrs = argResults.flatMap((r) => r.instrs)
  const slots = argResults.map((r) => r.slot)

  if (isTail) {
    for (let i = 0; i < slots.length; i++) {
      instrs.push(
        ii("mov", [ro("rax"), rd("rbp", locDisp(slots[i]))]),
        ii("mov", [rd("rbp", argDisp(i)), ro("rax")]),
      )
    }
    instrs.push(
      ii("mov", [ro("rsp"), ro("rbp")]),
      ii("pop", [ro("rbp")]),
      ii("pop", [ro("r11")]),
      ii("push", [ro("r11")]),
      ii("jmp", [lb(targetName)]),
    )
    return instrs
  }

  for (let i = slots.length - 1; i >= 0; i--) {
    instrs.push(ii("push", [rd("rbp", locDisp(slots[i]))]))
  }
  instrs.push(ii("call", [lb(targetName)]))
  instrs.push(ii("add", [ro("rsp"), im(slots.length * 8)]))
  const dst = allocTemp(state)
  instrs.push(ii("mov", [rd("rbp", locDisp(dst)), ro("rax")]))
  return { instrs, slot: dst }
}

function emitDynApply(
  targetSlot: number,
  argSlots: Array<number>,
  isTail: boolean,
): Array<X86.Instr> {
  const argc = argSlots.length
  const arrSize = argc * 8
  const instrs: Array<X86.Instr> = [
    ii("sub", [ro("rsp"), im(arrSize)]),
  ]
  for (let i = 0; i < argc; i++) {
    instrs.push(
      ii("mov", [ro("rax"), rd("rbp", locDisp(argSlots[i]))]),
      ii("mov", [rd("rsp", i * 8), ro("rax")]),
    )
  }
  instrs.push(
    ii("mov", [ro("rdi"), rd("rbp", locDisp(targetSlot))]),
    ii("mov", [ro("rsi"), im(argc)]),
    ii("mov", [ro("rdx"), ro("rsp")]),
    ii("call", [ex("native-apply")]),
    ii("add", [ro("rsp"), im(arrSize)]),
  )
  if (isTail) {
    instrs.push(
      ii("mov", [ro("rsp"), ro("rbp")]),
      ii("pop", [ro("rbp")]),
      ii("ret", []),
    )
  }
  return instrs
}

function encInt(n: bigint): bigint {
  return (n << 3n) | 0n
}

function encFloat(n: number): bigint {
  const buf = new ArrayBuffer(8)
  const view = new DataView(buf)
  view.setFloat64(0, n, true)
  const bits = view.getBigUint64(0, true)
  return (bits & 0xfffffffffffffff8n) | 1n
}

let vrelocCounter = 0
function emitVreloc(state: State, className: string, arg: string): string {
  const name = `_vreloc_${vrelocCounter++}`
  state.x86Mod.valueRelocs.set(name, { name, className, arg })
  return name
}
