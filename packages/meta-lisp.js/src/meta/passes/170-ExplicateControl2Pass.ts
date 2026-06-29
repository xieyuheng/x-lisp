import * as S from "@xieyuheng/sexp.js"
import * as B2 from "../../basic2/index.ts"
import * as M from "../index.ts"

export function ExplicateControl2Pass(pkg: M.Package): B2.Mod {
  const mod = B2.createMod()
  const closure = M.packageClosureInTopologicalOrder(pkg)

  const literalMap = new Map<string, LiteralEntry>()
  let literalCounter = 0

  for (const orderedPkg of closure) {
    for (const m of orderedPkg.mods.values()) {
      const pending: Array<VariableInit> = []

      for (const definition of m.definitions.values()) {
        compileDefinition(mod, definition, pending, literalMap, literalCounter)
      }

      for (const init of pending) {
        generateVariableSetup(mod, init)
      }
    }
  }

  return mod
}

type LiteralEntry = {
  dataVar: string
  valueVar: string
}

type VariableInit = {
  pkg: M.Package
  qname: string
  body: M.Term
}

type CompileState = {
  mod: B2.Mod
  pkg: M.Package
  blocks: Map<string, B2.Block>
  currentBlock: B2.Block | null
  nameCounters: Map<string, number>
  literalMap: Map<string, LiteralEntry>
  literalCounter: number
}

function freshId(state: CompileState, base: string): string {
  const n = state.nameCounters.get(base) ?? 0
  state.nameCounters.set(base, n + 1)
  return base + "." + String(n)
}

function freshLabel(state: CompileState, prefix: string): string {
  return prefix + "." + String(state.blocks.size)
}

function createBlock(state: CompileState, label: string): B2.Block {
  const block = B2.Block(label, [])
  state.blocks.set(label, block)
  return block
}

function setCurrentBlock(state: CompileState, block: B2.Block): void {
  state.currentBlock = block
}

function emitInstr(state: CompileState, instr: B2.Instr): void {
  state.currentBlock!.instrs.push(instr)
}

function blocksList(state: CompileState): Array<B2.Block> {
  return Array.from(state.blocks.values())
}

function qualifiedName(def: M.Definition): string {
  return `${def.mod.pkg.id}/${def.mod.name}/${def.name}`
}

function resolveXvmPrefix(pkg: M.Package, pkgName: string): string {
  if (pkgName === pkg.id) return pkg.id
  const dep = pkg.dependencies.get(pkgName)
  if (!dep) {
    throw new Error(`unknown package: "${pkgName}"`)
  }
  return dep.id
}

const terminatorOps = new Set([
  "return",
  "goto",
  "branch",
  "tail-call",
  "tail-apply",
  "unreachable",
])

function isTerminator(instr: B2.Instr): boolean {
  return terminatorOps.has(instr.op)
}

function lastInstr(block: B2.Block): B2.Instr | null {
  if (block.instrs.length === 0) return null
  return block.instrs[block.instrs.length - 1]
}

function lastValueInstr(instrs: Array<B2.Instr>): B2.Instr {
  for (let i = instrs.length - 1; i >= 0; i--) {
    if (instrs[i].type.kind !== "VoidType") return instrs[i]
  }
  throw new Error("expected value-producing instr")
}

function valueTypeArrow(n: number): B2.Type {
  const args: Array<B2.Type> = []
  for (let i = 0; i < n; i++) args.push(B2.ValueType())
  return B2.ArrowType(args, B2.ValueType())
}

function compileDefinition(
  mod: B2.Mod,
  def: M.Definition,
  pending: Array<VariableInit>,
  literalMap: Map<string, LiteralEntry>,
  literalCounter: number,
): void {
  const qname = qualifiedName(def)

  switch (def.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveFunctionDefinition": {
      mod.claims.set(qname, valueTypeArrow(def.arity))
      return
    }
    case "PrimitiveVariableDeclaration":
    case "PrimitiveVariableDefinition": {
      mod.claims.set(qname, B2.ValueType())
      return
    }
    case "FunctionDefinition": {
      mod.claims.set(qname, valueTypeArrow(def.parameters.length))
      mod.definitions.set(
        qname,
        compileFunctionState(
          qname,
          def.parameters,
          def.body,
          def.mod.pkg,
          mod,
          literalMap,
          literalCounter,
        ),
      )
      return
    }
    case "VariableDefinition": {
      mod.claims.set(qname, B2.ValueType())
      mod.definitions.set(qname, B2.VariableDefinition(qname, null))
      pending.push({ pkg: def.mod.pkg, qname, body: def.body })
      return
    }
    case "TestDefinition": {
      mod.claims.set(qname, B2.ArrowType([], B2.BoolType()))
      mod.definitions.set(
        qname,
        compileFunctionState(
          qname,
          [],
          def.body,
          def.mod.pkg,
          mod,
          literalMap,
          literalCounter,
        ),
      )
      return
    }
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition":
    case "TypeDefinition": {
      return
    }
  }
}

function compileFunctionState(
  qname: string,
  params: Array<string>,
  body: M.Term,
  pkg: M.Package,
  mod: B2.Mod,
  literalMap: Map<string, LiteralEntry>,
  literalCounter: number,
): B2.FunctionDefinition {
  const state: CompileState = {
    mod,
    pkg,
    blocks: new Map(),
    currentBlock: null,
    nameCounters: new Map(),
    literalMap,
    literalCounter,
  }

  const bodyBlock = B2.Block("body", [])
  state.blocks.set("body", bodyBlock)
  setCurrentBlock(state, bodyBlock)

  for (let i = 0; i < params.length; i++) {
    emitInstr(
      state,
      B2.Instr(params[i], B2.ValueType(), "argument", [], {
        ":index": B2.IntAttribute(i),
      }),
    )
  }

  const instrs = compileTail(state, body)
  for (const instr of instrs) {
    emitInstr(state, instr)
  }

  const tail = lastInstr(bodyBlock)
  if (!tail || !isTerminator(tail)) {
    emitInstr(
      state,
      B2.Instr(
        freshId(state, "return"),
        B2.VoidType(),
        "return",
        [B2.VoidOperand()],
        {},
      ),
    )
  }

  return B2.FunctionDefinition(qname, blocksList(state))
}

function compileTail(state: CompileState, term: M.Term): Array<B2.Instr> {
  switch (term.kind) {
    case "Let1Term": {
      if (term.rhs.kind === "IfTerm") {
        const mergeInstrs = compileIf(
          state,
          term.rhs.condition,
          term.rhs.consequent,
          term.rhs.alternative,
          term.name,
        )
        const bodyInstrs = compileTail(state, term.body)
        return [...mergeInstrs, ...bodyInstrs]
      }

      const rhsInstrs = compileAtom(state, term.rhs)
      const last = lastValueInstr(rhsInstrs)
      rhsInstrs[rhsInstrs.length - 1] = { ...last, id: term.name }
      const bodyInstrs = compileTail(state, term.body)
      return [...rhsInstrs, ...bodyInstrs]
    }

    case "Begin1Term": {
      const headInstrs = compileAtom(state, term.head)
      const bodyInstrs = compileTail(state, term.body)
      return [...headInstrs, ...bodyInstrs]
    }

    case "IfTerm": {
      return compileIf(state, term.condition, term.consequent, term.alternative)
    }

    case "VarTerm": {
      const id = freshId(state, "const")
      return [
        B2.Instr(id, B2.ValueType(), "const", [B2.VarOperand(term.name)], {}),
        B2.Instr(
          freshId(state, "return"),
          B2.VoidType(),
          "return",
          [B2.VarOperand(id)],
          {},
        ),
      ]
    }

    case "QualifiedVarTerm": {
      const fullName = resolveVarName(
        state.pkg,
        term.pkgName,
        term.modName,
        term.name,
      )
      const ptrId = freshId(state, "const")
      const valId = freshId(state, "load")
      return [
        B2.Instr(
          ptrId,
          B2.PointerType(),
          "const",
          [B2.AddressOperand(fullName)],
          {},
        ),
        B2.Instr(valId, B2.ValueType(), "load", [B2.VarOperand(ptrId)], {}),
        B2.Instr(
          freshId(state, "return"),
          B2.VoidType(),
          "return",
          [B2.VarOperand(valId)],
          {},
        ),
      ]
    }

    case "IntTerm": {
      const id = freshId(state, "tag-int")
      return [
        B2.Instr(
          id,
          B2.ValueType(),
          "tag-int",
          [B2.Int64Operand(term.content)],
          {},
        ),
        B2.Instr(
          freshId(state, "return"),
          B2.VoidType(),
          "return",
          [B2.VarOperand(id)],
          {},
        ),
      ]
    }

    case "FloatTerm": {
      const id = freshId(state, "tag-float")
      return [
        B2.Instr(
          id,
          B2.ValueType(),
          "tag-float",
          [B2.Float64Operand(term.content)],
          {},
        ),
        B2.Instr(
          freshId(state, "return"),
          B2.VoidType(),
          "return",
          [B2.VarOperand(id)],
          {},
        ),
      ]
    }

    case "ApplyTerm": {
      const instrs = compileApply(state, term)
      const last = lastValueInstr(instrs)
      instrs.push(
        B2.Instr(
          freshId(state, "return"),
          B2.VoidType(),
          "return",
          [B2.VarOperand(last.id)],
          {},
        ),
      )
      return instrs
    }

    case "SymbolTerm":
    case "StringTerm":
    case "KeywordTerm": {
      const valueVar = ensureLiteral(state, term)
      const ptrId = freshId(state, "const")
      const valId = freshId(state, "load")
      return [
        B2.Instr(
          ptrId,
          B2.PointerType(),
          "const",
          [B2.AddressOperand(valueVar)],
          {},
        ),
        B2.Instr(valId, B2.ValueType(), "load", [B2.VarOperand(ptrId)], {}),
        B2.Instr(
          freshId(state, "return"),
          B2.VoidType(),
          "return",
          [B2.VarOperand(valId)],
          {},
        ),
      ]
    }

    default: {
      throw new S.ErrorWithSourceLocation(
        `[ExplicateControl2Pass] unhandled term kind in compileTail: ${term.kind}`,
        term.location,
      )
    }
  }
}

function compileAtom(state: CompileState, term: M.Term): Array<B2.Instr> {
  switch (term.kind) {
    case "VarTerm": {
      const id = freshId(state, "const")
      return [
        B2.Instr(id, B2.ValueType(), "const", [B2.VarOperand(term.name)], {}),
      ]
    }

    case "QualifiedVarTerm": {
      const fullName = resolveVarName(
        state.pkg,
        term.pkgName,
        term.modName,
        term.name,
      )
      const ptrId = freshId(state, "const")
      const valId = freshId(state, "load")
      return [
        B2.Instr(
          ptrId,
          B2.PointerType(),
          "const",
          [B2.AddressOperand(fullName)],
          {},
        ),
        B2.Instr(valId, B2.ValueType(), "load", [B2.VarOperand(ptrId)], {}),
      ]
    }

    case "ApplyTerm": {
      return compileApply(state, term)
    }

    case "IfTerm": {
      const mergeName = freshId(state, "merge")
      return compileIf(state, term.condition, term.consequent, term.alternative, mergeName)
    }

    case "Let1Term": {
      if (term.rhs.kind === "IfTerm") {
        const rhsInstrs = compileIf(
          state, term.rhs.condition, term.rhs.consequent, term.rhs.alternative, term.name,
        )
        const bodyInstrs = compileAtom(state, term.body)
        return [...rhsInstrs, ...bodyInstrs]
      }
      const rhsInstrs = compileAtom(state, term.rhs)
      const last = lastValueInstr(rhsInstrs)
      rhsInstrs[rhsInstrs.length - 1] = { ...last, id: term.name }
      const bodyInstrs = compileAtom(state, term.body)
      return [...rhsInstrs, ...bodyInstrs]
    }

    case "Begin1Term": {
      const headInstrs = compileAtom(state, term.head)
      const bodyInstrs = compileAtom(state, term.body)
      return [...headInstrs, ...bodyInstrs]
    }

    case "IntTerm": {
      const id = freshId(state, "tag-int")
      return [
        B2.Instr(
          id,
          B2.ValueType(),
          "tag-int",
          [B2.Int64Operand(term.content)],
          {},
        ),
      ]
    }

    case "FloatTerm": {
      const id = freshId(state, "tag-float")
      return [
        B2.Instr(
          id,
          B2.ValueType(),
          "tag-float",
          [B2.Float64Operand(term.content)],
          {},
        ),
      ]
    }

    case "SymbolTerm":
    case "StringTerm":
    case "KeywordTerm": {
      const valueVar = ensureLiteral(state, term)
      const ptrId = freshId(state, "const")
      const valId = freshId(state, "load")
      return [
        B2.Instr(
          ptrId,
          B2.PointerType(),
          "const",
          [B2.AddressOperand(valueVar)],
          {},
        ),
        B2.Instr(valId, B2.ValueType(), "load", [B2.VarOperand(ptrId)], {}),
      ]
    }

    default: {
      throw new S.ErrorWithSourceLocation(
        `[ExplicateControl2Pass] unhandled term kind in compileAtom: ${term.kind}`,
        term.location,
      )
    }
  }
}

function compileIf(
  state: CompileState,
  condition: M.Term,
  consequent: M.Term,
  alternative: M.Term,
  mergeName?: string,
): Array<B2.Instr> {
  if (
    condition.kind === "QualifiedVarTerm" &&
    condition.pkgName === "meta-builtin" &&
    condition.modName === "builtin"
  ) {
    if (condition.name === "true") return compileTail(state, consequent)
    if (condition.name === "false") return compileTail(state, alternative)
  }

  if (
    condition.kind === "ApplyTerm" &&
    condition.target.kind === "QualifiedVarTerm" &&
    condition.target.pkgName === "meta-builtin" &&
    condition.target.modName === "builtin" &&
    condition.target.name === "not" &&
    condition.args.length === 1
  ) {
    return compileIf(
      state,
      condition.args[0],
      alternative,
      consequent,
      mergeName,
    )
  }

  const condInstrs = compileAtom(state, condition)
  const condVarId = lastValueInstr(condInstrs).id

  const condBoolId = freshId(state, "to-bool")
  condInstrs.push(
    B2.Instr(
      condBoolId,
      B2.BoolType(),
      "to-bool",
      [B2.VarOperand(condVarId)],
      {},
    ),
  )

  const thenLabel = freshLabel(state, "then")
  const elseLabel = freshLabel(state, "else")

  condInstrs.push(
    B2.Instr(
      freshId(state, "branch"),
      B2.VoidType(),
      "branch",
      [B2.VarOperand(condBoolId)],
      {
        ":then-label": B2.SymbolAttribute(thenLabel),
        ":else-label": B2.SymbolAttribute(elseLabel),
      },
    ),
  )

  const thenBlock = createBlock(state, thenLabel)
  setCurrentBlock(state, thenBlock)
  const thenInstrs = compileTail(state, consequent)
  for (const instr of thenInstrs) emitInstr(state, instr)

  const elseBlock = createBlock(state, elseLabel)
  setCurrentBlock(state, elseBlock)
  const elseInstrs = compileTail(state, alternative)
  for (const instr of elseInstrs) emitInstr(state, instr)

  if (mergeName !== undefined) {
    const mergeLabel = freshLabel(state, "merge")
    addProvideAndGoto(state, thenBlock, mergeName, mergeLabel)
    addProvideAndGoto(state, elseBlock, mergeName, mergeLabel)

    const mergeBlock = createBlock(state, mergeLabel)
    setCurrentBlock(state, mergeBlock)
    return [...condInstrs, B2.Instr(mergeName, B2.ValueType(), "use", [], {})]
  }

  return condInstrs
}

function addProvideAndGoto(
  state: CompileState,
  block: B2.Block,
  mergeName: string,
  mergeLabel: string,
): void {
  const tail = lastInstr(block)
  if (tail && !isTerminator(tail)) {
    const valInstr = lastValueInstr(block.instrs)
    emitInstr(
      state,
      B2.Instr(
        freshId(state, "provide"),
        B2.VoidType(),
        "provide",
        [B2.VarOperand(valInstr.id)],
        {
          ":content-type": B2.TypeAttribute(B2.ValueType()),
          ":use-site": B2.SymbolAttribute(mergeName),
        },
      ),
    )
  }
  const last = lastInstr(block)
  if (!last || (last.op !== "goto" && last.op !== "return")) {
    emitInstr(
      state,
      B2.Instr(freshId(state, "goto"), B2.VoidType(), "goto", [], {
        ":label": B2.SymbolAttribute(mergeLabel),
      }),
    )
  }
}

const loweredPrimitives: Record<string, string> = {
  "meta-builtin/builtin/iadd": "iadd",
  "meta-builtin/builtin/isub": "isub",
  "meta-builtin/builtin/imul": "imul",
  "meta-builtin/builtin/idiv": "idiv",
  "meta-builtin/builtin/int-greater?": "icmp-gt",
  "meta-builtin/builtin/int-less?": "icmp-lt",
  "meta-builtin/builtin/int-greater-or-equal?": "icmp-ge",
  "meta-builtin/builtin/int-less-or-equal?": "icmp-le",
  "meta-builtin/builtin/same?": "value-eq",
  "meta-builtin/builtin/not": "not",
}

function compileApply(state: CompileState, term: M.ApplyTerm): Array<B2.Instr> {
  const instrs: Array<B2.Instr> = []
  const argIds: Array<string> = []

  for (const arg of term.args) {
    const argInstrs = compileAtom(state, arg)
    argIds.push(lastValueInstr(argInstrs).id)
    instrs.push(...argInstrs)
  }

  if (
    term.target.kind === "QualifiedVarTerm" &&
    term.target.pkgName === "meta-builtin" &&
    term.target.modName === "builtin"
  ) {
    const fullName = resolveVarName(
      state.pkg,
      term.target.pkgName,
      term.target.modName,
      term.target.name,
    )
    const opName = loweredPrimitives[fullName]
    if (opName) {
      const sig = (B2.knownBinaryOps[opName] ?? B2.knownUnaryOps[opName]) as B2.ArrowType
      if (argIds.length === sig.argTypes.length) {
        instrs.push(...compileLowered(state, opName, argIds))
        return instrs
      }
    }

    const callId = freshId(state, "call")
    instrs.push(
      B2.Instr(
        callId,
        B2.ValueType(),
        "call",
        [B2.AddressOperand(fullName), ...argIds.map((id) => B2.VarOperand(id))],
        {},
      ),
    )
    return instrs
  }

  if (term.target.kind === "QualifiedVarTerm") {
    const fullName = resolveVarName(
      state.pkg,
      term.target.pkgName,
      term.target.modName,
      term.target.name,
    )
    const ptrId = freshId(state, "const")
    instrs.push(
      B2.Instr(
        ptrId,
        B2.PointerType(),
        "const",
        [B2.AddressOperand(fullName)],
        {},
      ),
    )
    const callId = freshId(state, "call")
    instrs.push(
      B2.Instr(
        callId,
        B2.ValueType(),
        "call",
        [B2.VarOperand(ptrId), ...argIds.map((id) => B2.VarOperand(id))],
        {},
      ),
    )
    return instrs
  }

  const targetInstrs = compileAtom(state, term.target)
  const targetLast = lastValueInstr(targetInstrs)
  instrs.push(...targetInstrs)

  const applyId = freshId(state, "apply")
  instrs.push(
    B2.Instr(
      applyId,
      B2.ValueType(),
      "apply",
      [B2.VarOperand(targetLast.id), ...argIds.map((id) => B2.VarOperand(id))],
      {},
    ),
  )
  return instrs
}

function untagOpForType(t: B2.Type): string | null {
  if (t.kind === "Int64Type") return "to-int64"
  if (t.kind === "Float64Type") return "to-float64"
  if (t.kind === "BoolType") return "to-bool"
  return null
}

function tagOpForType(t: B2.Type): string | null {
  if (t.kind === "Int64Type") return "tag-int"
  if (t.kind === "Float64Type") return "tag-float"
  if (t.kind === "BoolType") return "tag-bool"
  if (t.kind === "PointerType") return "tag-object"
  return null
}

function compileLowered(
  state: CompileState,
  opName: string,
  argIds: Array<string>,
): Array<B2.Instr> {
  const sig = (B2.knownBinaryOps[opName] ??
    B2.knownUnaryOps[opName]) as B2.ArrowType
  const argTypes = sig.argTypes
  const retType = sig.retType
  const rawArgIds: Array<string> = []
  const instrs: Array<B2.Instr> = []

  for (let i = 0; i < argTypes.length; i++) {
    const untagOp = untagOpForType(argTypes[i])
    if (untagOp) {
      const rawId = freshId(state, untagOp)
      instrs.push(
        B2.Instr(rawId, argTypes[i], untagOp, [B2.VarOperand(argIds[i])], {}),
      )
      rawArgIds.push(rawId)
    } else {
      rawArgIds.push(argIds[i])
    }
  }

  const rawResultId = freshId(state, opName)
  instrs.push(
    B2.Instr(
      rawResultId,
      retType,
      opName,
      rawArgIds.map((id) => B2.VarOperand(id)),
      {},
    ),
  )

  const tagOp = tagOpForType(retType)
  if (tagOp) {
    const resultId = freshId(state, tagOp)
    instrs.push(
      B2.Instr(
        resultId,
        B2.ValueType(),
        tagOp,
        [B2.VarOperand(rawResultId)],
        {},
      ),
    )
  }

  return instrs
}

function resolveVarName(
  pkg: M.Package,
  pkgName: string,
  modName: string,
  name: string,
): string {
  const prefix = resolveXvmPrefix(pkg, pkgName)
  return `${prefix}/${modName}/${name}`
}

function literalKey(term: M.SymbolTerm | M.StringTerm | M.KeywordTerm): string {
  switch (term.kind) {
    case "SymbolTerm":
      return "symbol:" + term.content
    case "StringTerm":
      return "string:" + term.content
    case "KeywordTerm":
      return "keyword:" + term.content
  }
}

function ensureLiteral(
  state: CompileState,
  term: M.SymbolTerm | M.StringTerm | M.KeywordTerm,
): string {
  const key = literalKey(term)
  const existing = state.literalMap.get(key)
  if (existing) return existing.valueVar

  const pkgId = state.pkg.id
  const strIndex = state.literalCounter++
  const strName = `${pkgId}/builtin/©str.${strIndex}`

  state.mod.definitions.set(
    strName,
    B2.VariableDefinition(strName, B2.StringExp(term.content)),
  )

  const litIndex = state.literalCounter++
  const litName = `${pkgId}/builtin/©lit.${litIndex}`

  state.mod.claims.set(litName, B2.ValueType())
  state.mod.definitions.set(litName, B2.VariableDefinition(litName, null))

  let cFuncName: string
  switch (term.kind) {
    case "SymbolTerm":
      cFuncName = "intern_symbol"
      break
    case "StringTerm":
      cFuncName = "make_static_xstring"
      break
    case "KeywordTerm":
      cFuncName = "intern_keyword"
      break
  }

  const cClaim = cFuncName
  if (!state.mod.claims.has(cClaim)) {
    state.mod.claims.set(
      cClaim,
      B2.ArrowType([B2.PointerType()], B2.PointerType()),
    )
  }

  const setupQname = litName + "©setup"
  state.mod.claims.set(setupQname, B2.ArrowType([], B2.VoidType()))

  const setupBlock = B2.Block("body", [])
  setupBlock.instrs.push(
    B2.Instr(
      "const.0",
      B2.PointerType(),
      "const",
      [B2.AddressOperand(strName)],
      {},
    ),
  )
  setupBlock.instrs.push(
    B2.Instr(
      "call.0",
      B2.PointerType(),
      "call",
      [B2.AddressOperand(cFuncName), B2.VarOperand("const.0")],
      {},
    ),
  )
  setupBlock.instrs.push(
    B2.Instr(
      "tag-object.0",
      B2.ValueType(),
      "tag-object",
      [B2.VarOperand("call.0")],
      {},
    ),
  )
  setupBlock.instrs.push(
    B2.Instr(
      "const.1",
      B2.PointerType(),
      "const",
      [B2.AddressOperand(litName)],
      {},
    ),
  )
  setupBlock.instrs.push(
    B2.Instr(
      "store.0",
      B2.VoidType(),
      "store",
      [B2.VarOperand("const.1"), B2.VarOperand("tag-object.0")],
      { ":content-type": B2.TypeAttribute(B2.ValueType()) },
    ),
  )
  setupBlock.instrs.push(
    B2.Instr("return.0", B2.VoidType(), "return", [B2.VoidOperand()], {}),
  )

  state.mod.definitions.set(
    setupQname,
    B2.FunctionDefinition(setupQname, [setupBlock]),
  )

  const entry: LiteralEntry = { dataVar: strName, valueVar: litName }
  state.literalMap.set(key, entry)

  return litName
}

function generateVariableSetup(mod: B2.Mod, init: VariableInit): void {
  const setupQname = init.qname + "©setup"
  mod.claims.set(setupQname, B2.ArrowType([], B2.VoidType()))

  const bodyBlock = B2.Block("body", [])

  const state: CompileState = {
    mod,
    pkg: init.pkg,
    blocks: new Map(),
    currentBlock: null,
    nameCounters: new Map(),
    literalMap: new Map(),
    literalCounter: 0,
  }
  state.blocks.set("body", bodyBlock)
  setCurrentBlock(state, bodyBlock)

  const bodyInstrs = compileAtom(state, init.body)
  for (const instr of bodyInstrs) emitInstr(state, instr)

  const lastVal = lastValueInstr(bodyInstrs)

  const ptrId = freshId(state, "const")
  emitInstr(
    state,
    B2.Instr(
      ptrId,
      B2.PointerType(),
      "const",
      [B2.AddressOperand(init.qname)],
      {},
    ),
  )

  emitInstr(
    state,
    B2.Instr(
      freshId(state, "store"),
      B2.VoidType(),
      "store",
      [B2.VarOperand(ptrId), B2.VarOperand(lastVal.id)],
      { ":content-type": B2.TypeAttribute(B2.ValueType()) },
    ),
  )

  emitInstr(
    state,
    B2.Instr(
      freshId(state, "return"),
      B2.VoidType(),
      "return",
      [B2.VoidOperand()],
      {},
    ),
  )

  mod.definitions.set(
    setupQname,
    B2.FunctionDefinition(setupQname, blocksList(state)),
  )
}
