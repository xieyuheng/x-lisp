import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../../meta/index.ts"
import * as Xvm from "../../xvm/index.ts"

export function XvmCodegenPass(pkg: M.Package, basicMod: B.Mod): Xvm.Mod {
  const xvmMod = Xvm.createMod()
  for (const definition of basicMod.definitions.values()) {
    for (const stackDefinition of codegenDefinition(basicMod, definition)) {
      xvmMod.definitions.set(stackDefinition.name, stackDefinition)
    }
  }

  return xvmMod
}

type State = {
  mod: B.Mod
  location: SourceLocation
  localIndexes: Map<string, number>
  nextLocal: number
}

type CodegenResult = {
  instrs: Array<Xvm.Instr>
  result: number
}

function createState(mod: B.Mod, location: SourceLocation): State {
  return {
    mod,
    location,
    localIndexes: new Map(),
    nextLocal: 0,
  }
}

function addLocalIndexes(state: State, name: string): void {
  const index = state.localIndexes.get(name)
  if (index === undefined) {
    const newIndex = state.localIndexes.size
    state.localIndexes.set(name, newIndex)
  }
}

function lookupLocalIndex(state: State, name: string): number {
  const index = state.localIndexes.get(name)
  if (index === undefined) {
    let message = `[lookupLocalIndex] undefined name: ${name}`
    throw new Error(message)
  }

  return index
}

function allocateTemp(state: State): number {
  const temp = state.nextLocal
  state.nextLocal = temp + 1
  return temp
}

function collectLocalIndexes(state: State, definition: B.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      return null
    }

    case "FunctionDefinition": {
      for (const parameter of definition.parameters) {
        addLocalIndexes(state, parameter)
      }

      for (const block of definition.blocks.values()) {
        collectLocalIndexesFromBlock(state, block)
      }

      return null
    }

    case "VariableDefinition": {
      for (const block of definition.blocks.values()) {
        collectLocalIndexesFromBlock(state, block)
      }

      return null
    }

    case "TestDefinition": {
      for (const block of definition.blocks.values()) {
        collectLocalIndexesFromBlock(state, block)
      }

      return null
    }
  }
}

function collectLocalIndexesFromBlock(state: State, block: B.Block): void {
  for (const instr of block.instrs) {
    collectLocalIndexesFromInstr(state, instr)
  }
}

function collectLocalIndexesFromInstr(state: State, instr: B.Instr): void {
  if (instr.kind === "AssignInstr") {
    addLocalIndexes(state, instr.dest)
  }
}

function codegenDefinition(
  mod: B.Mod,
  definition: B.Definition,
): Array<Xvm.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return [
        Xvm.PrimitiveFunctionDeclaration(
          definition.name,
          definition.arity,
          definition.location,
        ),
      ]
    }

    case "PrimitiveVariableDeclaration": {
      return [
        Xvm.PrimitiveVariableDeclaration(definition.name, definition.location),
      ]
    }

    case "FunctionDefinition": {
      const state = createState(mod, definition.location)
      collectLocalIndexes(state, definition)
      state.nextLocal = state.localIndexes.size
      const blocks = definition.blocks.values()
      const instrs = [
        ...blocks.flatMap((block) =>
          codegenBlock(state, definition.name, block),
        ),
      ]
      return [
        Xvm.FunctionDefinition(
          definition.name,
          definition.parameters.length,
          instrs,
          definition.location,
        ),
      ]
    }

    case "VariableDefinition": {
      const state = createState(mod, definition.location)
      collectLocalIndexes(state, definition)
      state.nextLocal = state.localIndexes.size
      const blocks = definition.blocks.values()
      const instrs = [
        ...blocks.flatMap((block) =>
          codegenBlock(state, definition.name, block),
        ),
      ]
      return [
        Xvm.VariableDefinition(definition.name, instrs, definition.location),
      ]
    }

    case "TestDefinition": {
      const state = createState(mod, definition.location)
      collectLocalIndexes(state, definition)
      state.nextLocal = state.localIndexes.size
      const blocks = definition.blocks.values()
      const instrs = [
        ...blocks.flatMap((block) =>
          codegenBlock(state, definition.name, block),
        ),
      ]
      return [Xvm.TestDefinition(definition.name, instrs, definition.location)]
    }
  }
}

function codegenBlock(
  state: State,
  name: string,
  block: B.Block,
): Array<Xvm.Instr> {
  const instrs: Array<Xvm.Instr> = [
    Xvm.Instr(
      "label",
      [Xvm.VarOperand(block.label, state.location)],
      state.location,
    ),
  ]

  let pendingCondition: number | null = null

  for (const instr of block.instrs) {
    if (instr.kind === "TestInstr") {
      const { instrs: expInstrs, result } = codegenExp(state, name, instr.exp)
      instrs.push(...expInstrs)
      pendingCondition = result
    } else if (instr.kind === "BranchInstr") {
      if (pendingCondition === null) {
        throw new Error("[XvmCodegenPass] BranchInstr without TestInstr")
      }

      instrs.push(
        Xvm.Instr(
          "jump-if-not",
          [
            Xvm.IntOperand(BigInt(pendingCondition), state.location),
            Xvm.VarOperand(instr.elseLabel, state.location),
          ],
          state.location,
        ),
        Xvm.Instr(
          "jump",
          [Xvm.VarOperand(instr.thenLabel, state.location)],
          state.location,
        ),
      )
      pendingCondition = null
    } else {
      instrs.push(...codegenInstr(state, name, instr))
    }
  }

  return instrs
}

function toIntOp(n: number, loc: SourceLocation): Xvm.IntOperand {
  return Xvm.IntOperand(BigInt(n), loc)
}

function codegenInstr(
  state: State,
  name: string,
  instr: B.Instr,
): Array<Xvm.Instr> {
  switch (instr.kind) {
    case "AssignInstr": {
      const { instrs, result } = codegenExp(state, name, instr.exp)
      const destIndex = lookupLocalIndex(state, instr.dest)
      if (result !== destIndex) {
        instrs.push(
          Xvm.Instr(
            "move",
            [
              toIntOp(destIndex, state.location),
              toIntOp(result, state.location),
              Xvm.VarOperand(instr.dest, state.location),
            ],
            state.location,
          ),
        )
      }
      return instrs
    }

    case "PerformInstr": {
      const { instrs } = codegenExp(state, name, instr.exp)
      return instrs
    }

    case "TestInstr": {
      return codegenExp(state, name, instr.exp).instrs
    }

    case "BranchInstr": {
      throw new Error("[XvmCodegenPass] BranchInstr handled in codegenBlock")
    }

    case "GotoInstr": {
      return [
        Xvm.Instr(
          "jump",
          [Xvm.VarOperand(instr.label, state.location)],
          state.location,
        ),
      ]
    }

    case "ReturnInstr": {
      return codegenTailExp(state, name, instr.exp)
    }
  }
}

function basicAtomToOperand(exp: B.Exp): Xvm.Operand {
  switch (exp.kind) {
    case "SymbolExp":
      return Xvm.SymbolOperand(exp.content, exp.location)
    case "KeywordExp":
      return Xvm.KeywordOperand(exp.content, exp.location)
    case "StringExp":
      return Xvm.StringOperand(exp.content, exp.location)
    case "IntExp":
      return Xvm.IntOperand(exp.content, exp.location)
    case "FloatExp":
      return Xvm.FloatOperand(exp.content, exp.location)
    case "VarExp":
      return Xvm.VarOperand(exp.name, exp.location)
    case "ApplyExp": {
      let message = `[basicAtomToOperand] unhandled exp`
      message += `\n  exp: ${B.formatExp(exp)}`
      throw new Error(message)
    }
  }
}

function codegenExp(state: State, name: string, exp: B.Exp): CodegenResult {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp": {
      const dst = allocateTemp(state)
      return {
        instrs: [
          Xvm.Instr(
            "load",
            [toIntOp(dst, state.location), basicAtomToOperand(exp)],
            state.location,
          ),
        ],
        result: dst,
      }
    }

    case "VarExp": {
      return codegenVar(state, name, exp)
    }

    case "ApplyExp": {
      return codegenApply(state, name, exp)
    }
  }
}

function codegenTailExp(
  state: State,
  name: string,
  exp: B.Exp,
): Array<Xvm.Instr> {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp": {
      const dst = allocateTemp(state)
      return [
        Xvm.Instr(
          "load",
          [toIntOp(dst, state.location), basicAtomToOperand(exp)],
          state.location,
        ),
        Xvm.Instr("return", [toIntOp(dst, state.location)], state.location),
      ]
    }

    case "VarExp": {
      const { instrs, result } = codegenVar(state, name, exp)
      instrs.push(
        Xvm.Instr("return", [toIntOp(result, state.location)], state.location),
      )
      return instrs
    }

    case "ApplyExp": {
      return codegenTailApply(state, name, exp)
    }
  }
}

function codegenVar(state: State, name: string, exp: B.VarExp): CodegenResult {
  const definition = B.modLookupDefinition(state.mod, exp.name)
  if (definition === undefined) {
    return {
      instrs: [],
      result: lookupLocalIndex(state, exp.name),
    }
  }

  switch (definition.kind) {
    case "TestDefinition": {
      let message = `[XvmCodegenPass / codegenVar] can not handle TestDefinition`
      throw new Error(message)
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      const dst = allocateTemp(state)
      return {
        instrs: [
          Xvm.Instr(
            "ref",
            [
              toIntOp(dst, state.location),
              Xvm.VarOperand(exp.name, state.location),
            ],
            state.location,
          ),
        ],
        result: dst,
      }
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      const dst = allocateTemp(state)
      return {
        instrs: [
          Xvm.Instr(
            "global-load",
            [
              toIntOp(dst, state.location),
              Xvm.VarOperand(exp.name, state.location),
            ],
            state.location,
          ),
        ],
        result: dst,
      }
    }
  }
}

function codegenApply(
  state: State,
  name: string,
  exp: B.ApplyExp,
): CodegenResult {
  return codegenGeneralApply(state, name, exp, false) as CodegenResult
}

function codegenTailApply(
  state: State,
  name: string,
  exp: B.ApplyExp,
): Array<Xvm.Instr> {
  return codegenGeneralApply(state, name, exp, true) as Array<Xvm.Instr>
}

function codegenGeneralApply(
  state: State,
  name: string,
  exp: B.ApplyExp,
  isTail: boolean,
): CodegenResult | Array<Xvm.Instr> {
  const applyMode = isTail ? "tail-apply" : "apply"
  const callMode = isTail ? "tail-call" : "call"
  const loc = state.location

  const definition = B.modLookupDefinition(
    state.mod,
    B.asVarExp(exp.target).name,
  )

  if (definition === undefined) {
    const argResults = exp.args.map((arg) => codegenExp(state, name, arg))
    const targetResult = codegenExp(state, name, exp.target)
    const instrs: Array<Xvm.Instr> = [
      ...argResults.flatMap((r) => r.instrs),
      ...targetResult.instrs,
      Xvm.Instr(
        applyMode,
        [
          toIntOp(targetResult.result, loc),
          ...argResults.map((r) => toIntOp(r.result, loc)),
        ],
        loc,
      ),
    ]
    if (isTail) return instrs
    const dst = allocateTemp(state)
    instrs.push(Xvm.Instr("load-result", [toIntOp(dst, loc)], loc))
    return { instrs, result: dst }
  }

  switch (definition.kind) {
    case "TestDefinition": {
      let message = `[XvmCodegenPass / codegenGeneralApply] can not handle TestDefinition`
      throw new Error(message)
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      const arity = B.definitionArity(definition)
      if (exp.args.length < arity) {
        const argResults = exp.args.map((arg) => codegenExp(state, name, arg))
        const refDst = allocateTemp(state)
        const instrs: Array<Xvm.Instr> = [
          ...argResults.flatMap((r) => r.instrs),
          Xvm.Instr(
            "ref",
            [
              toIntOp(refDst, loc),
              Xvm.VarOperand(B.asVarExp(exp.target).name, loc),
            ],
            loc,
          ),
          Xvm.Instr(
            applyMode,
            [
              toIntOp(refDst, loc),
              ...argResults.map((r) => toIntOp(r.result, loc)),
            ],
            loc,
          ),
        ]
        if (isTail) return instrs
        const dst = allocateTemp(state)
        instrs.push(Xvm.Instr("load-result", [toIntOp(dst, loc)], loc))
        return { instrs, result: dst }
      } else if (exp.args.length === arity) {
        const argResults = exp.args.map((arg) => codegenExp(state, name, arg))
        const instrs: Array<Xvm.Instr> = [
          ...argResults.flatMap((r) => r.instrs),
          Xvm.Instr(
            callMode,
            [
              Xvm.VarOperand(B.asVarExp(exp.target).name, loc),
              ...argResults.map((r) => toIntOp(r.result, loc)),
            ],
            loc,
          ),
        ]
        if (isTail) return instrs
        const dst = allocateTemp(state)
        instrs.push(Xvm.Instr("load-result", [toIntOp(dst, loc)], loc))
        return { instrs, result: dst }
      } else {
        const firstArgs = exp.args.slice(0, arity)
        const restArgs = exp.args.slice(arity)
        const firstArgResults = firstArgs.map((arg) =>
          codegenExp(state, name, arg),
        )
        const restArgResults = restArgs.map((arg) =>
          codegenExp(state, name, arg),
        )

        const instrs: Array<Xvm.Instr> = [
          ...firstArgResults.flatMap((r) => r.instrs),
          Xvm.Instr(
            "call",
            [
              Xvm.VarOperand(B.asVarExp(exp.target).name, loc),
              ...firstArgResults.map((r) => toIntOp(r.result, loc)),
            ],
            loc,
          ),
        ]

        if (isTail) {
          const tempResult = allocateTemp(state)
          instrs.push(Xvm.Instr("load-result", [toIntOp(tempResult, loc)], loc))
          instrs.push(...restArgResults.flatMap((r) => r.instrs))
          instrs.push(
            Xvm.Instr(
              "tail-apply",
              [
                toIntOp(tempResult, loc),
                ...restArgResults.map((r) => toIntOp(r.result, loc)),
              ],
              loc,
            ),
          )
          return instrs
        } else {
          const tempResult = allocateTemp(state)
          instrs.push(Xvm.Instr("load-result", [toIntOp(tempResult, loc)], loc))
          instrs.push(...restArgResults.flatMap((r) => r.instrs))
          instrs.push(
            Xvm.Instr(
              "apply",
              [
                toIntOp(tempResult, loc),
                ...restArgResults.map((r) => toIntOp(r.result, loc)),
              ],
              loc,
            ),
          )
          const dst = allocateTemp(state)
          instrs.push(Xvm.Instr("load-result", [toIntOp(dst, loc)], loc))
          return { instrs, result: dst }
        }
      }
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      const argResults = exp.args.map((arg) => codegenExp(state, name, arg))
      const dst = allocateTemp(state)
      const instrs: Array<Xvm.Instr> = [
        ...argResults.flatMap((r) => r.instrs),
        Xvm.Instr(
          "global-load",
          [toIntOp(dst, loc), Xvm.VarOperand(B.asVarExp(exp.target).name, loc)],
          loc,
        ),
        Xvm.Instr(
          applyMode,
          [toIntOp(dst, loc), ...argResults.map((r) => toIntOp(r.result, loc))],
          loc,
        ),
      ]
      if (isTail) return instrs
      const resultDst = allocateTemp(state)
      instrs.push(Xvm.Instr("load-result", [toIntOp(resultDst, loc)], loc))
      return { instrs, result: resultDst }
    }
  }
}
