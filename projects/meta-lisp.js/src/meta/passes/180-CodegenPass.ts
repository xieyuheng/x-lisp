import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../../meta/index.ts"
import * as Stk from "../../stack/index.ts"

export function CodegenPass(project: M.Project, basicMod: B.Mod): Stk.Mod {
  const stackMod = Stk.createMod()
  for (const definition of basicMod.definitions.values()) {
    for (const stackDefinition of codegenDefinition(basicMod, definition)) {
      stackMod.definitions.set(stackDefinition.name, stackDefinition)
    }
  }

  return stackMod
}

type State = {
  mod: B.Mod
  location: SourceLocation
  localIndexes: Map<string, number>
}

function createState(mod: B.Mod, location: SourceLocation): State {
  return {
    mod,
    location,
    localIndexes: new Map(),
  }
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

function codegenDefinition(
  mod: B.Mod,
  definition: B.Definition,
): Array<Stk.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return [
        Stk.PrimitiveFunctionDeclaration(
          definition.name,
          definition.arity,
          definition.location,
        ),
      ]
    }

    case "PrimitiveVariableDeclaration": {
      return [
        Stk.PrimitiveVariableDeclaration(definition.name, definition.location),
      ]
    }

    case "FunctionDefinition": {
      const state = createState(mod, definition.location)
      collectLocalIndexes(state, definition)
      const blocks = definition.blocks.values()
      const instrs = [
        ...definition.parameters
          .toReversed()
          .map((parameter) =>
            Stk.Instr(
              "local-store",
              [
                Stk.IntOperand(
                  BigInt(lookupLocalIndex(state, parameter)),
                  state.location,
                ),
                Stk.VarOperand(parameter, state.location),
              ],
              state.location,
            ),
          ),
        ...blocks.flatMap((block) =>
          codegenBlock(state, definition.name, block),
        ),
      ]
      return [
        Stk.FunctionDefinition(
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
      const blocks = definition.blocks.values()
      const instrs = [
        ...blocks.flatMap((block) =>
          codegenBlock(state, definition.name, block),
        ),
      ]
      return [
        Stk.VariableDefinition(definition.name, instrs, definition.location),
      ]
    }

    case "TestDefinition": {
      const state = createState(mod, definition.location)
      collectLocalIndexes(state, definition)
      const blocks = definition.blocks.values()
      const instrs = [
        ...blocks.flatMap((block) =>
          codegenBlock(state, definition.name, block),
        ),
      ]
      return [Stk.TestDefinition(definition.name, instrs, definition.location)]
    }
  }
}

function codegenBlock(
  state: State,
  name: string,
  block: B.Block,
): Array<Stk.Instr> {
  return [
    Stk.Instr(
      "label",
      [Stk.VarOperand(block.label, state.location)],
      state.location,
    ),
    ...block.instrs.flatMap((instr) => codegenInstr(state, name, instr)),
  ]
}

function codegenInstr(
  state: State,
  name: string,
  instr: B.Instr,
): Array<Stk.Instr> {
  switch (instr.kind) {
    case "AssignInstr": {
      return [
        ...codegenExp(state, name, instr.exp),
        Stk.Instr(
          "local-store",
          [
            Stk.IntOperand(
              BigInt(lookupLocalIndex(state, instr.dest)),
              state.location,
            ),
            Stk.VarOperand(instr.dest, state.location),
          ],
          state.location,
        ),
      ]
    }

    case "PerformInstr": {
      return [
        ...codegenExp(state, name, instr.exp),
        Stk.Instr("drop", [], state.location),
      ]
    }

    case "TestInstr": {
      return codegenExp(state, name, instr.exp)
    }

    case "BranchInstr": {
      return [
        Stk.Instr(
          "jump-if-not",
          [Stk.VarOperand(instr.elseLabel, state.location)],
          state.location,
        ),
        Stk.Instr(
          "jump",
          [Stk.VarOperand(instr.thenLabel, state.location)],
          state.location,
        ),
      ]
    }

    case "GotoInstr": {
      return [
        Stk.Instr(
          "jump",
          [Stk.VarOperand(instr.label, state.location)],
          state.location,
        ),
      ]
    }

    case "ReturnInstr": {
      return codegenTailExp(state, name, instr.exp)
    }
  }
}

function basicAtomToOperand(exp: B.Exp): Stk.Operand {
  switch (exp.kind) {
    case "SymbolExp":
      return Stk.SymbolOperand(exp.content, exp.location)
    case "KeywordExp":
      return Stk.KeywordOperand(exp.content, exp.location)
    case "StringExp":
      return Stk.StringOperand(exp.content, exp.location)
    case "IntExp":
      return Stk.IntOperand(exp.content, exp.location)
    case "FloatExp":
      return Stk.FloatOperand(exp.content, exp.location)
    case "VarExp":
      return Stk.VarOperand(exp.name, exp.location)
    case "ApplyExp": {
      let message = `[basicAtomToOperand] unhandled exp`
      message += `\n  exp: ${B.formatExp(exp)}`
      throw new Error(message)
    }
  }
}

function codegenExp(state: State, name: string, exp: B.Exp): Array<Stk.Instr> {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp": {
      return [Stk.Instr("literal", [basicAtomToOperand(exp)], state.location)]
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
): Array<Stk.Instr> {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp": {
      return [
        Stk.Instr("literal", [basicAtomToOperand(exp)], state.location),
        Stk.Instr("return", [], state.location),
      ]
    }

    case "VarExp": {
      return [
        ...codegenVar(state, name, exp),
        Stk.Instr("return", [], state.location),
      ]
    }

    case "ApplyExp": {
      return codegenTailApply(state, name, exp)
    }
  }
}

function codegenVar(
  state: State,
  name: string,
  exp: B.VarExp,
): Array<Stk.Instr> {
  const definition = B.modLookupDefinition(state.mod, exp.name)
  if (definition === undefined) {
    return [
      Stk.Instr(
        "local-load",
        [
          Stk.IntOperand(
            BigInt(lookupLocalIndex(state, exp.name)),
            state.location,
          ),
          Stk.VarOperand(exp.name, state.location),
        ],
        state.location,
      ),
    ]
  }

  switch (definition.kind) {
    case "TestDefinition": {
      let message = `[CodegenPass / codegenVar] can not handle TestDefinition`
      throw new Error(message)
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      return [
        Stk.Instr(
          "ref",
          [Stk.VarOperand(exp.name, state.location)],
          state.location,
        ),
      ]
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        Stk.Instr(
          "global-load",
          [Stk.VarOperand(exp.name, state.location)],
          state.location,
        ),
      ]
    }
  }
}

function codegenApply(
  state: State,
  name: string,
  exp: B.ApplyExp,
): Array<Stk.Instr> {
  return codegenGeneralApply(state, name, exp, false)
}

function codegenTailApply(
  state: State,
  name: string,
  exp: B.ApplyExp,
): Array<Stk.Instr> {
  return codegenGeneralApply(state, name, exp, true)
}

function codegenGeneralApply(
  state: State,
  name: string,
  exp: B.ApplyExp,
  isTail: boolean,
): Array<Stk.Instr> {
  const applyMode = isTail ? "tail-apply" : "apply"
  const callMode = isTail ? "tail-call" : "call"
  const definition = B.modLookupDefinition(
    state.mod,
    B.asVarExp(exp.target).name,
  )
  if (definition === undefined) {
    return [
      ...exp.args.flatMap((arg) => codegenExp(state, name, arg)),
      Stk.Instr(
        "local-load",
        [
          Stk.IntOperand(
            BigInt(lookupLocalIndex(state, B.asVarExp(exp.target).name)),
            state.location,
          ),
          Stk.VarOperand(B.asVarExp(exp.target).name, state.location),
        ],
        state.location,
      ),
      Stk.Instr(
        applyMode,
        [Stk.IntOperand(BigInt(exp.args.length), state.location)],
        state.location,
      ),
    ]
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
        return [
          ...exp.args.flatMap((arg) => codegenExp(state, name, arg)),
          Stk.Instr(
            "ref",
            [Stk.VarOperand(B.asVarExp(exp.target).name, state.location)],
            state.location,
          ),
          Stk.Instr(
            applyMode,
            [Stk.IntOperand(BigInt(exp.args.length), state.location)],
            state.location,
          ),
        ]
      } else if (exp.args.length === arity) {
        return [
          ...exp.args.flatMap((arg) => codegenExp(state, name, arg)),
          Stk.Instr(
            callMode,
            [Stk.VarOperand(B.asVarExp(exp.target).name, state.location)],
            state.location,
          ),
        ]
      } else {
        return [
          ...exp.args
            .slice(0, arity)
            .flatMap((arg) => codegenExp(state, name, arg)),
          Stk.Instr(
            "call",
            [Stk.VarOperand(B.asVarExp(exp.target).name, state.location)],
            state.location,
          ),
          ...exp.args
            .slice(arity)
            .flatMap((arg) => codegenExp(state, name, arg)),
          Stk.Instr(
            applyMode,
            [Stk.IntOperand(BigInt(exp.args.length - arity), state.location)],
            state.location,
          ),
        ]
      }
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        ...exp.args.flatMap((arg) => codegenExp(state, name, arg)),
        Stk.Instr(
          "global-load",
          [Stk.VarOperand(B.asVarExp(exp.target).name, state.location)],
          state.location,
        ),
        Stk.Instr(
          applyMode,
          [Stk.IntOperand(BigInt(exp.args.length), state.location)],
          state.location,
        ),
      ]
    }
  }
}
