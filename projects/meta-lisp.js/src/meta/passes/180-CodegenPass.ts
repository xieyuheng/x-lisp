import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../../meta/index.ts"
import * as Xasm from "../../xasm/index.ts"

export function CodegenPass(project: M.Project, basicMod: B.Mod): Xasm.Mod {
  const stackMod = Xasm.createMod()
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
      const blocks = definition.blocks.values()
      const instrs = [
        ...definition.parameters
          .toReversed()
          .map((parameter) =>
            Xasm.Instr(
              "local-store",
              [
                Xasm.IntOperand(
                  BigInt(lookupLocalIndex(state, parameter)),
                  state.location,
                ),
                Xasm.VarOperand(parameter, state.location),
              ],
              state.location,
            ),
          ),
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
  return [
    Xasm.Instr(
      "label",
      [Xasm.VarOperand(block.label, state.location)],
      state.location,
    ),
    ...block.instrs.flatMap((instr) => codegenInstr(state, name, instr)),
  ]
}

function codegenInstr(
  state: State,
  name: string,
  instr: B.Instr,
): Array<Xasm.Instr> {
  switch (instr.kind) {
    case "AssignInstr": {
      return [
        ...codegenExp(state, name, instr.exp),
        Xasm.Instr(
          "local-store",
          [
            Xasm.IntOperand(
              BigInt(lookupLocalIndex(state, instr.dest)),
              state.location,
            ),
            Xasm.VarOperand(instr.dest, state.location),
          ],
          state.location,
        ),
      ]
    }

    case "PerformInstr": {
      return [
        ...codegenExp(state, name, instr.exp),
        Xasm.Instr("drop", [], state.location),
      ]
    }

    case "TestInstr": {
      return codegenExp(state, name, instr.exp)
    }

    case "BranchInstr": {
      return [
        Xasm.Instr(
          "jump-if-not",
          [Xasm.VarOperand(instr.elseLabel, state.location)],
          state.location,
        ),
        Xasm.Instr(
          "jump",
          [Xasm.VarOperand(instr.thenLabel, state.location)],
          state.location,
        ),
      ]
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

function codegenExp(state: State, name: string, exp: B.Exp): Array<Xasm.Instr> {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp": {
      return [Xasm.Instr("literal", [basicAtomToOperand(exp)], state.location)]
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
      return [
        Xasm.Instr("literal", [basicAtomToOperand(exp)], state.location),
        Xasm.Instr("return", [], state.location),
      ]
    }

    case "VarExp": {
      return [
        ...codegenVar(state, name, exp),
        Xasm.Instr("return", [], state.location),
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
): Array<Xasm.Instr> {
  const definition = B.modLookupDefinition(state.mod, exp.name)
  if (definition === undefined) {
    return [
      Xasm.Instr(
        "local-load",
        [
          Xasm.IntOperand(
            BigInt(lookupLocalIndex(state, exp.name)),
            state.location,
          ),
          Xasm.VarOperand(exp.name, state.location),
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
        Xasm.Instr(
          "ref",
          [Xasm.VarOperand(exp.name, state.location)],
          state.location,
        ),
      ]
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        Xasm.Instr(
          "global-load",
          [Xasm.VarOperand(exp.name, state.location)],
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
): Array<Xasm.Instr> {
  return codegenGeneralApply(state, name, exp, false)
}

function codegenTailApply(
  state: State,
  name: string,
  exp: B.ApplyExp,
): Array<Xasm.Instr> {
  return codegenGeneralApply(state, name, exp, true)
}

function codegenGeneralApply(
  state: State,
  name: string,
  exp: B.ApplyExp,
  isTail: boolean,
): Array<Xasm.Instr> {
  const applyMode = isTail ? "tail-apply" : "apply"
  const callMode = isTail ? "tail-call" : "call"
  const definition = B.modLookupDefinition(
    state.mod,
    B.asVarExp(exp.target).name,
  )
  if (definition === undefined) {
    return [
      ...exp.args.flatMap((arg) => codegenExp(state, name, arg)),
      Xasm.Instr(
        "local-load",
        [
          Xasm.IntOperand(
            BigInt(lookupLocalIndex(state, B.asVarExp(exp.target).name)),
            state.location,
          ),
          Xasm.VarOperand(B.asVarExp(exp.target).name, state.location),
        ],
        state.location,
      ),
      Xasm.Instr(
        applyMode,
        [Xasm.IntOperand(BigInt(exp.args.length), state.location)],
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
          Xasm.Instr(
            "ref",
            [Xasm.VarOperand(B.asVarExp(exp.target).name, state.location)],
            state.location,
          ),
          Xasm.Instr(
            applyMode,
            [Xasm.IntOperand(BigInt(exp.args.length), state.location)],
            state.location,
          ),
        ]
      } else if (exp.args.length === arity) {
        return [
          ...exp.args.flatMap((arg) => codegenExp(state, name, arg)),
          Xasm.Instr(
            callMode,
            [Xasm.VarOperand(B.asVarExp(exp.target).name, state.location)],
            state.location,
          ),
        ]
      } else {
        return [
          ...exp.args
            .slice(0, arity)
            .flatMap((arg) => codegenExp(state, name, arg)),
          Xasm.Instr(
            "call",
            [Xasm.VarOperand(B.asVarExp(exp.target).name, state.location)],
            state.location,
          ),
          ...exp.args
            .slice(arity)
            .flatMap((arg) => codegenExp(state, name, arg)),
          Xasm.Instr(
            applyMode,
            [Xasm.IntOperand(BigInt(exp.args.length - arity), state.location)],
            state.location,
          ),
        ]
      }
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        ...exp.args.flatMap((arg) => codegenExp(state, name, arg)),
        Xasm.Instr(
          "global-load",
          [Xasm.VarOperand(B.asVarExp(exp.target).name, state.location)],
          state.location,
        ),
        Xasm.Instr(
          applyMode,
          [Xasm.IntOperand(BigInt(exp.args.length), state.location)],
          state.location,
        ),
      ]
    }
  }
}
