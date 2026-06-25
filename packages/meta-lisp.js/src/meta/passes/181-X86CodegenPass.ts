import * as S from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../../meta/index.ts"
import * as X86 from "../../x86/index.ts"

const ZERO = S.zeroLocation("")

export function X86CodegenPass(pkg: M.Package, basicMod: B.Mod): X86.Mod {
  const x86Mod = X86.createMod()

  X86.SubmitPass(x86Mod, [
    X86.DefineStructStmt(
      "gc-map-t",
      [
        { name: "local-count", exp: X86.VarExp("uint16-t", ZERO) },
        { name: "callee-saved-count", exp: X86.VarExp("uint8-t", ZERO) },
        { name: "reserved", exp: X86.VarExp("uint8-t", ZERO) },
      ],
      ZERO,
    ),
    X86.DefineStructStmt(
      "function-metadata-t",
      [
        { name: "arity", exp: X86.VarExp("uint16-t", ZERO) },
        { name: "flags", exp: X86.VarExp("uint16-t", ZERO) },
        { name: "gc-map", exp: X86.VarExp("gc-map-t", ZERO) },
        { name: "name", exp: X86.VarExp("string-t", ZERO) },
      ],
      ZERO,
    ),
  ])

  for (const definition of basicMod.definitions.values()) {
    switch (definition.kind) {
      case "PrimitiveFunctionDeclaration":
      case "PrimitiveVariableDeclaration":
        break
      case "FunctionDefinition": {
        for (const generated of codegenFunction(x86Mod, basicMod, definition)) {
          X86.modDefine(x86Mod, generated)
        }
        break
      }
      case "VariableDefinition": {
        for (const generated of codegenVariableDefinition(
          x86Mod,
          basicMod,
          definition,
          false,
        )) {
          X86.modDefine(x86Mod, generated)
        }
        break
      }
      case "TestDefinition": {
        const variableDefinition: B.VariableDefinition = {
          kind: "VariableDefinition",
          mod: definition.mod,
          name: definition.name,
          blocks: definition.blocks,
          location: definition.location,
        }
        for (const generated of codegenVariableDefinition(
          x86Mod,
          basicMod,
          variableDefinition,
          true,
        )) {
          X86.modDefine(x86Mod, generated)
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

function makeState(basicMod: B.Mod, x86Mod: X86.Mod, argCount: number): State {
  return {
    basicMod,
    x86Mod,
    argCount,
    localOffsets: new Map(),
    nextLocal: 2,
  }
}

function allocLocal(state: State, name: string): number {
  const e = state.localOffsets.get(name)
  if (e !== undefined) return e
  const slot = state.nextLocal
  state.localOffsets.set(name, slot)
  state.nextLocal++
  return slot
}

function allocateTemporary(state: State): number {
  const slot = state.nextLocal
  state.nextLocal++
  return slot
}

function localSlot(state: State, name: string): number {
  return state.localOffsets.get(name) ?? allocLocal(state, name)
}

function localDisplacement(slot: number): number {
  return -(8 + slot * 8)
}

function argumentDisplacement(index: number): number {
  return 16 + index * 8
}

function regDeref(reg: string, disp: number): X86.RegDerefOperand {
  return X86.RegDerefOperand(
    reg,
    undefined,
    undefined,
    X86.IntDisplacement(BigInt(disp), ZERO),
    ZERO,
  )
}
function regOperand(name: string): X86.RegOperand {
  return X86.RegOperand(name, ZERO)
}
function immOperand(value: number | bigint): X86.ImmOperand {
  return X86.ImmOperand(BigInt(value), ZERO)
}
function labelOperand(name: string): X86.LabelOperand {
  return X86.LabelOperand(name, ZERO)
}
function addressOperand(name: string): X86.AddressOperand {
  return X86.AddressOperand(name, ZERO)
}
function derefOperand(name: string): X86.DerefOperand {
  return X86.DerefOperand(addressOperand(name), ZERO)
}
function externalLabel(name: string): X86.ExternalLabelOperand {
  return X86.ExternalLabelOperand(name, ZERO)
}
function conditionCode(code: string): X86.CcOperand {
  return X86.CcOperand(code, ZERO)
}
function makeInstr(op: string, ops: Array<X86.Operand>): X86.Instr {
  return X86.Instr(op, ops, ZERO)
}

function codegenFunction(
  x86Mod: X86.Mod,
  basicMod: B.Mod,
  definition: B.FunctionDefinition,
): Array<X86.Definition> {
  const state = makeState(basicMod, x86Mod, definition.parameters.length)
  for (const p of definition.parameters) allocLocal(state, p)

  const bodyBlocks: Array<X86.Block> = []
  for (const block of definition.blocks.values()) {
    bodyBlocks.push(...compileBlock(state, block))
  }

  const rawFrameBytes = state.nextLocal * 8 + 8
  const frameBytes =
    rawFrameBytes % 16 === 0 ? rawFrameBytes + 8 : rawFrameBytes

  const prologue: Array<X86.Instr> = [
    makeInstr("push", [regOperand("rbp")]),
    makeInstr("mov", [regOperand("rbp"), regOperand("rsp")]),
    makeInstr("sub", [regOperand("rsp"), immOperand(frameBytes)]),
    makeInstr("mov", [
      regOperand("rax"),
      addressOperand(`.meta.${definition.name}`),
    ]),
    makeInstr("mov", [regDeref("rbp", -8), regOperand("rax")]),
  ]

  for (let i = 0; i < definition.parameters.length; i++) {
    const p = definition.parameters[i]
    const slot = state.localOffsets.get(p)
    if (slot !== undefined) {
      prologue.push(
        makeInstr("mov", [
          regOperand("rax"),
          regDeref("rbp", argumentDisplacement(i)),
        ]),
        makeInstr("mov", [
          regDeref("rbp", localDisplacement(slot)),
          regOperand("rax"),
        ]),
      )
    }
  }

  const blocks: Array<X86.Block> = [
    { name: `${definition.name}.prologue`, instrs: prologue, location: ZERO },
    ...bodyBlocks,
    {
      name: `${definition.name}.epilogue`,
      instrs: [
        makeInstr("mov", [regOperand("rsp"), regOperand("rbp")]),
        makeInstr("pop", [regOperand("rbp")]),
        makeInstr("ret", []),
      ],
      location: ZERO,
    },
  ]

  const codeDef: X86.CodeDefinition = {
    kind: "CodeDefinition",
    name: definition.name,
    blocks,
    location: definition.location,
  }

  const metaDef: X86.MetadataDefinition = {
    kind: "MetadataDefinition",
    target: definition.name,
    value: X86.PointerExp(
      X86.StructExp(
        "function-metadata-t",
        [
          {
            name: "arity",
            exp: X86.IntExp(BigInt(definition.parameters.length), ZERO),
          },
          { name: "flags", exp: X86.IntExp(0n, ZERO) },
          {
            name: "gc-map",
            exp: X86.StructExp(
              undefined,
              [
                {
                  name: "local-count",
                  exp: X86.IntExp(BigInt(state.nextLocal), ZERO),
                },
                { name: "callee-saved-count", exp: X86.IntExp(0n, ZERO) },
                { name: "reserved", exp: X86.IntExp(0n, ZERO) },
              ],
              ZERO,
            ),
          },
          { name: "name", exp: X86.StringExp(definition.name, ZERO) },
        ],
        ZERO,
      ),
      ZERO,
    ),
    location: definition.location,
  }

  return [codeDef, metaDef]
}

function codegenVariableDefinition(
  x86Mod: X86.Mod,
  basicMod: B.Mod,
  definition: B.VariableDefinition,
  isTest: boolean,
): Array<X86.Definition> {
  const state = makeState(basicMod, x86Mod, 0)

  const bodyBlocks: Array<X86.Block> = []
  for (const block of definition.blocks.values()) {
    bodyBlocks.push(...compileBlock(state, block))
  }

  const rawFrameBytes = state.nextLocal * 8 + 8
  const frameBytes =
    rawFrameBytes % 16 === 0 ? rawFrameBytes + 8 : rawFrameBytes

  const blocks: Array<X86.Block> = [
    {
      name: `${definition.name}.prologue`,
      instrs: [
        makeInstr("push", [regOperand("rbp")]),
        makeInstr("mov", [regOperand("rbp"), regOperand("rsp")]),
        makeInstr("sub", [regOperand("rsp"), immOperand(frameBytes)]),
      ],
      location: ZERO,
    },
    ...bodyBlocks,
    {
      name: `${definition.name}.epilogue`,
      instrs: [
        makeInstr("mov", [regOperand("rax"), immOperand(22)]),
        makeInstr("mov", [regOperand("rsp"), regOperand("rbp")]),
        makeInstr("pop", [regOperand("rbp")]),
        makeInstr("ret", []),
      ],
      location: ZERO,
    },
  ]

  const codeDef: X86.CodeDefinition = {
    kind: "CodeDefinition",
    name: definition.name,
    blocks,
    location: definition.location,
  }

  const metaDef: X86.MetadataDefinition = {
    kind: "MetadataDefinition",
    target: definition.name,
    value: X86.PointerExp(
      X86.StructExp(
        "function-metadata-t",
        [
          { name: "arity", exp: X86.IntExp(0n, ZERO) },
          { name: "flags", exp: X86.IntExp(isTest ? 1n : 0n, ZERO) },
          {
            name: "gc-map",
            exp: X86.StructExp(
              undefined,
              [
                {
                  name: "local-count",
                  exp: X86.IntExp(BigInt(state.nextLocal), ZERO),
                },
                { name: "callee-saved-count", exp: X86.IntExp(0n, ZERO) },
                { name: "reserved", exp: X86.IntExp(0n, ZERO) },
              ],
              ZERO,
            ),
          },
          { name: "name", exp: X86.StringExp(definition.name, ZERO) },
        ],
        ZERO,
      ),
      ZERO,
    ),
    location: definition.location,
  }

  return [codeDef, metaDef]
}

function compileBlock(state: State, block: B.Block): Array<X86.Block> {
  const instrs: Array<X86.Instr> = []

  let pendingTest: number | null = null

  for (const instr of block.instrs) {
    if (instr.kind === "TestInstr") {
      const r = compileExp(state, instr.exp)
      instrs.push(...r.instrs)
      pendingTest = r.slot
    } else if (instr.kind === "BranchInstr") {
      if (pendingTest === null) throw new Error("BranchInstr without TestInstr")
      instrs.push(
        makeInstr("cmp", [
          regDeref("rbp", localDisplacement(pendingTest)),
          immOperand(6),
        ]),
        makeInstr("j", [conditionCode("ne"), labelOperand(instr.thenLabel)]),
        makeInstr("jmp", [labelOperand(instr.elseLabel)]),
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
      const d = localSlot(state, instr.dest)
      if (r.slot !== d) {
        r.instrs.push(
          makeInstr("mov", [
            regOperand("rax"),
            regDeref("rbp", localDisplacement(r.slot)),
          ]),
          makeInstr("mov", [
            regDeref("rbp", localDisplacement(d)),
            regOperand("rax"),
          ]),
        )
      }
      return r.instrs
    }
    case "PerformInstr":
      return compileExp(state, instr.exp).instrs
    case "TestInstr":
      return compileExp(state, instr.exp).instrs
    case "GotoInstr":
      return [makeInstr("jmp", [labelOperand(instr.label)])]
    case "ReturnInstr":
      return compileTail(state, instr.exp)
    case "BranchInstr":
      throw new Error("[X86CodegenPass] BranchInstr handled in compileBlock")
  }
}

type ExpR = { instrs: Array<X86.Instr>; slot: number }

function compileExp(state: State, exp: B.Exp): ExpR {
  switch (exp.kind) {
    case "IntExp": {
      const s = allocateTemporary(state)
      return {
        instrs: [
          makeInstr("mov", [
            regDeref("rbp", localDisplacement(s)),
            immOperand(encInt(exp.content)),
          ]),
        ],
        slot: s,
      }
    }
    case "FloatExp": {
      const s = allocateTemporary(state)
      return {
        instrs: [
          makeInstr("mov", [
            regDeref("rbp", localDisplacement(s)),
            immOperand(encFloat(exp.content)),
          ]),
        ],
        slot: s,
      }
    }
    case "StringExp": {
      const label = emitValueRelocation(state, "string", exp.content)
      const s = allocateTemporary(state)
      return {
        instrs: [
          makeInstr("mov", [regOperand("rax"), derefOperand(label)]),
          makeInstr("mov", [
            regDeref("rbp", localDisplacement(s)),
            regOperand("rax"),
          ]),
        ],
        slot: s,
      }
    }
    case "VarExp":
      return compileVar(state, exp)
    case "ApplyExp":
      return compileApply(state, exp)
    case "SymbolExp": {
      const label = emitValueRelocation(state, "symbol", exp.content)
      const s = allocateTemporary(state)
      return {
        instrs: [
          makeInstr("mov", [regOperand("rax"), derefOperand(label)]),
          makeInstr("mov", [
            regDeref("rbp", localDisplacement(s)),
            regOperand("rax"),
          ]),
        ],
        slot: s,
      }
    }
    case "KeywordExp": {
      const label = emitValueRelocation(state, "keyword", exp.content)
      const s = allocateTemporary(state)
      return {
        instrs: [
          makeInstr("mov", [regOperand("rax"), derefOperand(label)]),
          makeInstr("mov", [
            regDeref("rbp", localDisplacement(s)),
            regOperand("rax"),
          ]),
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
    makeInstr("mov", [
      regOperand("rax"),
      regDeref("rbp", localDisplacement(r.slot)),
    ]),
    makeInstr("mov", [regOperand("rsp"), regOperand("rbp")]),
    makeInstr("pop", [regOperand("rbp")]),
    makeInstr("ret", []),
  )
  return r.instrs
}

function compileVar(state: State, exp: B.VarExp): ExpR {
  const definition = B.modLookupDefinition(state.basicMod, exp.name)
  if (!definition) {
    const s = localSlot(state, exp.name)
    return { instrs: [], slot: s }
  }

  const label = emitValueRelocation(state, "definition", definition.name)
  const s = allocateTemporary(state)
  return {
    instrs: [
      makeInstr("mov", [regOperand("rax"), derefOperand(label)]),
      makeInstr("mov", [
        regDeref("rbp", localDisplacement(s)),
        regOperand("rax"),
      ]),
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
  const definition = targetName
    ? B.modLookupDefinition(state.basicMod, targetName)
    : undefined

  const isStaticCall =
    definition !== undefined &&
    targetName !== undefined &&
    (definition.kind === "PrimitiveFunctionDeclaration" ||
      definition.kind === "FunctionDefinition") &&
    exp.args.length === B.definitionArity(definition)

  if (isStaticCall) {
    return compileStaticCall(
      state,
      targetName,
      exp.args,
      isTail,
      definition.kind === "PrimitiveFunctionDeclaration",
    )
  }

  if (
    definition !== undefined &&
    targetName !== undefined &&
    (definition.kind === "PrimitiveFunctionDeclaration" ||
      definition.kind === "FunctionDefinition") &&
    exp.args.length < B.definitionArity(definition)
  ) {
    const argResults = exp.args.map((a) => compileExp(state, a))
    const refSlot = allocateTemporary(state)
    const valueRelocationLabel = emitValueRelocation(
      state,
      "definition",
      targetName,
    )
    const instrs: Array<X86.Instr> = [
      ...argResults.flatMap((r) => r.instrs),
      makeInstr("mov", [regOperand("rax"), derefOperand(valueRelocationLabel)]),
      makeInstr("mov", [
        regDeref("rbp", localDisplacement(refSlot)),
        regOperand("rax"),
      ]),
    ]
    instrs.push(
      ...emitDynApply(
        refSlot,
        argResults.map((r) => r.slot),
        isTail,
      ),
    )
    if (isTail) return instrs
    const dst = allocateTemporary(state)
    instrs.push(
      makeInstr("mov", [
        regDeref("rbp", localDisplacement(dst)),
        regOperand("rax"),
      ]),
    )
    return { instrs, slot: dst }
  }

  if (
    definition !== undefined &&
    targetName !== undefined &&
    (definition.kind === "PrimitiveFunctionDeclaration" ||
      definition.kind === "FunctionDefinition") &&
    exp.args.length > B.definitionArity(definition)
  ) {
    const arity = B.definitionArity(definition)
    const firstArgs = exp.args.slice(0, arity)
    const restArgs = exp.args.slice(arity)
    const isPrim = definition.kind === "PrimitiveFunctionDeclaration"
    const firstResults = firstArgs.map((a) => compileExp(state, a))
    const instrs: Array<X86.Instr> = [...firstResults.flatMap((r) => r.instrs)]

    if (isPrim) {
      const refSlot = allocateTemporary(state)
      const valueRelocationLabel = emitValueRelocation(
        state,
        "definition",
        targetName,
      )
      instrs.push(
        makeInstr("mov", [
          regOperand("rax"),
          derefOperand(valueRelocationLabel),
        ]),
        makeInstr("mov", [
          regDeref("rbp", localDisplacement(refSlot)),
          regOperand("rax"),
        ]),
      )
      instrs.push(
        ...emitDynApply(
          refSlot,
          firstResults.map((r) => r.slot),
          false,
        ),
      )
    } else {
      for (let i = arity - 1; i >= 0; i--) {
        instrs.push(
          makeInstr("push", [
            regDeref("rbp", localDisplacement(firstResults[i].slot)),
          ]),
        )
      }
      instrs.push(makeInstr("call", [labelOperand(targetName)]))
      instrs.push(makeInstr("add", [regOperand("rsp"), immOperand(arity * 8)]))
    }

    const temporary = allocateTemporary(state)
    instrs.push(
      makeInstr("mov", [
        regDeref("rbp", localDisplacement(temporary)),
        regOperand("rax"),
      ]),
    )

    const restResults = restArgs.map((a) => compileExp(state, a))
    instrs.push(...restResults.flatMap((r) => r.instrs))

    instrs.push(
      ...emitDynApply(
        temporary,
        restResults.map((r) => r.slot),
        isTail,
      ),
    )
    if (isTail) return instrs
    const dst = allocateTemporary(state)
    instrs.push(
      makeInstr("mov", [
        regDeref("rbp", localDisplacement(dst)),
        regOperand("rax"),
      ]),
    )
    return { instrs, slot: dst }
  }

  const argResults = exp.args.map((a) => compileExp(state, a))
  const targetResult = compileExp(state, exp.target)
  const instrs: Array<X86.Instr> = [
    ...argResults.flatMap((r) => r.instrs),
    ...targetResult.instrs,
  ]
  instrs.push(
    ...emitDynApply(
      targetResult.slot,
      argResults.map((r) => r.slot),
      isTail,
    ),
  )
  if (isTail) return instrs
  const dst = allocateTemporary(state)
  instrs.push(
    makeInstr("mov", [
      regDeref("rbp", localDisplacement(dst)),
      regOperand("rax"),
    ]),
  )
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
    const refSlot = allocateTemporary(state)
    const valueRelocationLabel = emitValueRelocation(
      state,
      "definition",
      targetName,
    )
    instrs.push(
      makeInstr("mov", [regOperand("rax"), derefOperand(valueRelocationLabel)]),
      makeInstr("mov", [
        regDeref("rbp", localDisplacement(refSlot)),
        regOperand("rax"),
      ]),
    )
    instrs.push(
      ...emitDynApply(
        refSlot,
        argResults.map((r) => r.slot),
        isTail,
      ),
    )
    if (isTail) return instrs
    const dst = allocateTemporary(state)
    instrs.push(
      makeInstr("mov", [
        regDeref("rbp", localDisplacement(dst)),
        regOperand("rax"),
      ]),
    )
    return { instrs, slot: dst }
  }

  const argResults = args.map((a) => compileExp(state, a))
  const instrs = argResults.flatMap((r) => r.instrs)
  const slots = argResults.map((r) => r.slot)

  if (isTail) {
    for (let i = 0; i < slots.length; i++) {
      instrs.push(
        makeInstr("mov", [
          regOperand("rax"),
          regDeref("rbp", localDisplacement(slots[i])),
        ]),
        makeInstr("mov", [
          regDeref("rbp", argumentDisplacement(i)),
          regOperand("rax"),
        ]),
      )
    }
    instrs.push(
      makeInstr("mov", [regOperand("rsp"), regOperand("rbp")]),
      makeInstr("pop", [regOperand("rbp")]),
      makeInstr("pop", [regOperand("r11")]),
      makeInstr("push", [regOperand("r11")]),
      makeInstr("jmp", [labelOperand(targetName)]),
    )
    return instrs
  }

  const staticPad = slots.length % 2 === 0 ? 8 : 0
  if (staticPad)
    instrs.push(makeInstr("sub", [regOperand("rsp"), immOperand(8)]))
  for (let i = slots.length - 1; i >= 0; i--) {
    instrs.push(
      makeInstr("push", [regDeref("rbp", localDisplacement(slots[i]))]),
    )
  }
  instrs.push(makeInstr("call", [labelOperand(targetName)]))
  const staticCleanup = slots.length * 8 + staticPad
  instrs.push(makeInstr("add", [regOperand("rsp"), immOperand(staticCleanup)]))
  const dst = allocateTemporary(state)
  instrs.push(
    makeInstr("mov", [
      regDeref("rbp", localDisplacement(dst)),
      regOperand("rax"),
    ]),
  )
  return { instrs, slot: dst }
}

function emitDynApply(
  targetSlot: number,
  argSlots: Array<number>,
  isTail: boolean,
): Array<X86.Instr> {
  const argc = argSlots.length
  const rawSize = argc * 8
  const arrSize = rawSize % 16 === 0 ? rawSize + 8 : rawSize
  const instrs: Array<X86.Instr> = [
    makeInstr("sub", [regOperand("rsp"), immOperand(arrSize)]),
  ]
  for (let i = 0; i < argc; i++) {
    instrs.push(
      makeInstr("mov", [
        regOperand("rax"),
        regDeref("rbp", localDisplacement(argSlots[i])),
      ]),
      makeInstr("mov", [regDeref("rsp", i * 8), regOperand("rax")]),
    )
  }
  instrs.push(
    makeInstr("mov", [
      regOperand("rdi"),
      regDeref("rbp", localDisplacement(targetSlot)),
    ]),
    makeInstr("mov", [regOperand("rsi"), immOperand(argc)]),
    makeInstr("mov", [regOperand("rdx"), regOperand("rsp")]),
    makeInstr("call", [externalLabel("native-apply")]),
    makeInstr("add", [regOperand("rsp"), immOperand(arrSize)]),
  )
  if (isTail) {
    instrs.push(
      makeInstr("mov", [regOperand("rsp"), regOperand("rbp")]),
      makeInstr("pop", [regOperand("rbp")]),
      makeInstr("ret", []),
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

let valueRelocationCounter = 0
function emitValueRelocation(
  state: State,
  className: string,
  arg: string,
): string {
  const name = `_value_reloc_${valueRelocationCounter++}`
  state.x86Mod.valueRelocations.set(name, { name, className, arg })
  return name
}
