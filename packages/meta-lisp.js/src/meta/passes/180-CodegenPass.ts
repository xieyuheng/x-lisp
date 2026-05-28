import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../../meta/index.ts"
import * as Xasm from "../../xasm/index.ts"

export function CodegenPass(pkg: M.Package, basicMod: B.Mod): Xasm.Mod {
  const xasmMod = Xasm.createMod()
  for (const definition of basicMod.definitions.values()) {
    for (const stackDefinition of codegenDefinition(basicMod, definition)) {
      xasmMod.definitions.set(stackDefinition.name, stackDefinition)
    }
  }

  return xasmMod
}

type State = {
  mod: B.Mod
  location: SourceLocation
  localIndexes: Map<string, number>
  nextLocal: number
}

type CodegenResult = {
  instrs: Array<Xasm.Instr>
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
): Array<Xasm.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return [
        Xasm.PrimitiveFunctionDeclaration(
          definition.name,
          definition.arity,
          definition.location,
        ),
      ]
    }

    case "PrimitiveVariableDeclaration": {
      return [
        Xasm.PrimitiveVariableDeclaration(definition.name, definition.location),
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
        Xasm.FunctionDefinition(
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
        Xasm.VariableDefinition(definition.name, instrs, definition.location),
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
      return [Xasm.TestDefinition(definition.name, instrs, definition.location)]
    }
  }
}

function codegenBlock(
  state: State,
  name: string,
  block: B.Block,
): Array<Xasm.Instr> {
  const instrs: Array<Xasm.Instr> = [
    Xasm.Instr(
      "label",
      [Xasm.VarOperand(block.label, state.location)],
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
        throw new Error("[CodegenPass] BranchInstr without TestInstr")
      }

      instrs.push(
        Xasm.Instr(
          "jump-if-not",
          [
            Xasm.IntOperand(BigInt(pendingCondition), state.location),
            Xasm.VarOperand(instr.elseLabel, state.location),
          ],
          state.location,
        ),
        Xasm.Instr(
          "jump",
          [Xasm.VarOperand(instr.thenLabel, state.location)],
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

function toIntOp(n: number, loc: SourceLocation): Xasm.IntOperand {
  return Xasm.IntOperand(BigInt(n), loc)
}

function codegenInstr(
  state: State,
  name: string,
  instr: B.Instr,
): Array<Xasm.Instr> {
  switch (instr.kind) {
    case "AssignInstr": {
      const { instrs, result } = codegenExp(state, name, instr.exp)
      const destIndex = lookupLocalIndex(state, instr.dest)
      if (result !== destIndex) {
        instrs.push(
          Xasm.Instr(
            "move",
            [
              toIntOp(destIndex, state.location),
              toIntOp(result, state.location),
              Xasm.VarOperand(instr.dest, state.location),
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
      throw new Error("[CodegenPass] BranchInstr handled in codegenBlock")
    }

    case "GotoInstr": {
      return [
        Xasm.Instr(
          "jump",
          [Xasm.VarOperand(instr.label, state.location)],
          state.location,
        ),
      ]
    }

    case "ReturnInstr": {
      return codegenTailExp(state, name, instr.exp)
    }
  }
}

function basicAtomToOperand(exp: B.Exp): Xasm.Operand {
  switch (exp.kind) {
    case "SymbolExp":
      return Xasm.SymbolOperand(exp.content, exp.location)
    case "KeywordExp":
      return Xasm.KeywordOperand(exp.content, exp.location)
    case "StringExp":
      return Xasm.StringOperand(exp.content, exp.location)
    case "IntExp":
      return Xasm.IntOperand(exp.content, exp.location)
    case "FloatExp":
      return Xasm.FloatOperand(exp.content, exp.location)
    case "VarExp":
      return Xasm.VarOperand(exp.name, exp.location)
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
          Xasm.Instr(
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
): Array<Xasm.Instr> {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp": {
      const dst = allocateTemp(state)
      return [
        Xasm.Instr(
          "load",
          [toIntOp(dst, state.location), basicAtomToOperand(exp)],
          state.location,
        ),
        Xasm.Instr("return", [toIntOp(dst, state.location)], state.location),
      ]
    }

    case "VarExp": {
      const { instrs, result } = codegenVar(state, name, exp)
      instrs.push(
        Xasm.Instr("return", [toIntOp(result, state.location)], state.location),
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
      let message = `[CodegenPass / codegenVar] can not handle TestDefinition`
      throw new Error(message)
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      const dst = allocateTemp(state)
      return {
        instrs: [
          Xasm.Instr(
            "ref",
            [
              toIntOp(dst, state.location),
              Xasm.VarOperand(exp.name, state.location),
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
          Xasm.Instr(
            "global-load",
            [
              toIntOp(dst, state.location),
              Xasm.VarOperand(exp.name, state.location),
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
): Array<Xasm.Instr> {
  return codegenGeneralApply(state, name, exp, true) as Array<Xasm.Instr>
}

function codegenGeneralApply(
  state: State,
  name: string,
  exp: B.ApplyExp,
  isTail: boolean,
): CodegenResult | Array<Xasm.Instr> {
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
    const instrs: Array<Xasm.Instr> = [
      ...argResults.flatMap((r) => r.instrs),
      ...targetResult.instrs,
      Xasm.Instr(
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
    instrs.push(Xasm.Instr("load-result", [toIntOp(dst, loc)], loc))
    return { instrs, result: dst }
  }

  switch (definition.kind) {
    case "TestDefinition": {
      let message = `[CodegenPass / codegenGeneralApply] can not handle TestDefinition`
      throw new Error(message)
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      const arity = B.definitionArity(definition)
      if (exp.args.length < arity) {
        const argResults = exp.args.map((arg) => codegenExp(state, name, arg))
        const refDst = allocateTemp(state)
        const instrs: Array<Xasm.Instr> = [
          ...argResults.flatMap((r) => r.instrs),
          Xasm.Instr(
            "ref",
            [
              toIntOp(refDst, loc),
              Xasm.VarOperand(B.asVarExp(exp.target).name, loc),
            ],
            loc,
          ),
          Xasm.Instr(
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
        instrs.push(Xasm.Instr("load-result", [toIntOp(dst, loc)], loc))
        return { instrs, result: dst }
      } else if (exp.args.length === arity) {
        const argResults = exp.args.map((arg) => codegenExp(state, name, arg))
        const instrs: Array<Xasm.Instr> = [
          ...argResults.flatMap((r) => r.instrs),
          Xasm.Instr(
            callMode,
            [
              Xasm.VarOperand(B.asVarExp(exp.target).name, loc),
              ...argResults.map((r) => toIntOp(r.result, loc)),
            ],
            loc,
          ),
        ]
        if (isTail) return instrs
        const dst = allocateTemp(state)
        instrs.push(Xasm.Instr("load-result", [toIntOp(dst, loc)], loc))
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

        const instrs: Array<Xasm.Instr> = [
          ...firstArgResults.flatMap((r) => r.instrs),
          Xasm.Instr(
            "call",
            [
              Xasm.VarOperand(B.asVarExp(exp.target).name, loc),
              ...firstArgResults.map((r) => toIntOp(r.result, loc)),
            ],
            loc,
          ),
        ]

        if (isTail) {
          const tempResult = allocateTemp(state)
          instrs.push(
            Xasm.Instr("load-result", [toIntOp(tempResult, loc)], loc),
          )
          instrs.push(...restArgResults.flatMap((r) => r.instrs))
          instrs.push(
            Xasm.Instr(
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
          instrs.push(
            Xasm.Instr("load-result", [toIntOp(tempResult, loc)], loc),
          )
          instrs.push(...restArgResults.flatMap((r) => r.instrs))
          instrs.push(
            Xasm.Instr(
              "apply",
              [
                toIntOp(tempResult, loc),
                ...restArgResults.map((r) => toIntOp(r.result, loc)),
              ],
              loc,
            ),
          )
          const dst = allocateTemp(state)
          instrs.push(Xasm.Instr("load-result", [toIntOp(dst, loc)], loc))
          return { instrs, result: dst }
        }
      }
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      const argResults = exp.args.map((arg) => codegenExp(state, name, arg))
      const dst = allocateTemp(state)
      const instrs: Array<Xasm.Instr> = [
        ...argResults.flatMap((r) => r.instrs),
        Xasm.Instr(
          "global-load",
          [
            toIntOp(dst, loc),
            Xasm.VarOperand(B.asVarExp(exp.target).name, loc),
          ],
          loc,
        ),
        Xasm.Instr(
          applyMode,
          [toIntOp(dst, loc), ...argResults.map((r) => toIntOp(r.result, loc))],
          loc,
        ),
      ]
      if (isTail) return instrs
      const resultDst = allocateTemp(state)
      instrs.push(Xasm.Instr("load-result", [toIntOp(resultDst, loc)], loc))
      return { instrs, result: resultDst }
    }
  }
}
