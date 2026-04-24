import * as B from "../../basic/index.ts"
import * as Stk from "../../stack/index.ts"

export function CodegenPass(
  basicMod: B.Mod,
  stackMod: Stk.Mod,
): void {
  for (const definition of basicMod.definitions.values()) {
    for (const stackDefinition of onDefinition(basicMod, definition)) {
      stackMod.definitions.set(stackDefinition.name, stackDefinition)
    }
  }
}

type State = {
  mod: B.Mod
  localIndexes: Map<string, number>
}

function createState(mod: B.Mod): State {
  return {
    mod,
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
  if (instr.kind === "Assign") {
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

function onDefinition(
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
      const state = createState(mod)
      collectLocalIndexes(state, definition)
      const blocks = definition.blocks.values()
      const instrs = [
        ...definition.parameters
          .toReversed()
          .map((parameter) =>
            Stk.Instr("local-store", [
              Stk.Int(BigInt(lookupLocalIndex(state, parameter))),
              Stk.Var(parameter),
            ]),
          ),
        ...blocks.flatMap((block) => onBlock(state, definition.name, block)),
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
      const state = createState(mod)
      collectLocalIndexes(state, definition)
      const blocks = definition.blocks.values()
      const instrs = [
        ...blocks.flatMap((block) => onBlock(state, definition.name, block)),
      ]
      return [
        Stk.VariableDefinition(definition.name, instrs, definition.location),
      ]
    }

    case "TestDefinition": {
      const state = createState(mod)
      collectLocalIndexes(state, definition)
      const blocks = definition.blocks.values()
      const instrs = [
        ...blocks.flatMap((block) => onBlock(state, definition.name, block)),
      ]
      return [Stk.TestDefinition(definition.name, instrs, definition.location)]
    }
  }
}

function onBlock(state: State, name: string, block: B.Block): Array<Stk.Instr> {
  return [
    Stk.Instr("label", [Stk.Var(block.label)]),
    ...block.instrs.flatMap((instr) => onInstr(state, name, instr)),
  ]
}

function onInstr(state: State, name: string, instr: B.Instr): Array<Stk.Instr> {
  switch (instr.kind) {
    case "Assign": {
      return [
        ...onExp(state, name, instr.exp),
        Stk.Instr("local-store", [
          Stk.Int(BigInt(lookupLocalIndex(state, instr.dest))),
          Stk.Var(instr.dest),
        ]),
      ]
    }

    case "Perform": {
      return [...onExp(state, name, instr.exp), Stk.Instr("drop", [])]
    }

    case "Test": {
      return onExp(state, name, instr.exp)
    }

    case "Branch": {
      return [
        Stk.Instr("jump-if-not", [Stk.Var(instr.elseLabel)]),
        Stk.Instr("jump", [Stk.Var(instr.thenLabel)]),
      ]
    }

    case "Goto": {
      return [Stk.Instr("jump", [Stk.Var(instr.label)])]
    }

    case "Return": {
      return onTailExp(state, name, instr.exp)
    }
  }
}

function onExp(state: State, name: string, exp: B.Exp): Array<Stk.Instr> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [Stk.Instr("literal", [exp])]
    }

    case "Var": {
      return onVar(state, name, exp)
    }

    case "Apply": {
      return onApply(state, name, exp)
    }
  }
}

function onTailExp(state: State, name: string, exp: B.Exp): Array<Stk.Instr> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [Stk.Instr("literal", [exp]), Stk.Instr("return", [])]
    }

    case "Var": {
      return [...onVar(state, name, exp), Stk.Instr("return", [])]
    }

    case "Apply": {
      return onTailApply(state, name, exp)
    }
  }
}

function onVar(state: State, name: string, exp: B.Var): Array<Stk.Instr> {
  const definition = B.modLookupDefinition(state.mod, exp.name)
  if (definition === undefined) {
    return [
      Stk.Instr("local-load", [
        Stk.Int(BigInt(lookupLocalIndex(state, exp.name))),
        Stk.Var(exp.name),
      ]),
    ]
  }

  switch (definition.kind) {
    case "TestDefinition": {
      let message = `[CodegenPass / onVar] can not handle TestDefinition`
      throw new Error(message)
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      return [Stk.Instr("ref", [Stk.Var(exp.name)])]
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [Stk.Instr("global-load", [Stk.Var(exp.name)])]
    }
  }
}

function onApply(state: State, name: string, exp: B.Apply): Array<Stk.Instr> {
  return onGeneralApply(state, name, exp, false)
}

function onTailApply(
  state: State,
  name: string,
  exp: B.Apply,
): Array<Stk.Instr> {
  return onGeneralApply(state, name, exp, true)
}

function onGeneralApply(
  state: State,
  name: string,
  exp: B.Apply,
  isTail: boolean,
): Array<Stk.Instr> {
  const applyMode = isTail ? "tail-apply" : "apply"
  const callMode = isTail ? "tail-call" : "call"
  const definition = B.modLookupDefinition(state.mod, B.asVar(exp.target).name)
  if (definition === undefined) {
    return [
      ...exp.args.flatMap((arg) => onExp(state, name, arg)),
      Stk.Instr("local-load", [
        Stk.Int(BigInt(lookupLocalIndex(state, B.asVar(exp.target).name))),
        Stk.Var(B.asVar(exp.target).name),
      ]),
      Stk.Instr(applyMode, [Stk.Int(BigInt(exp.args.length))]),
    ]
  }

  switch (definition.kind) {
    case "TestDefinition": {
      let message = `[CodegenPass / onGeneralApply] can not handle TestDefinition`
      throw new Error(message)
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      const arity = B.definitionArity(definition)
      if (exp.args.length < arity) {
        return [
          ...exp.args.flatMap((arg) => onExp(state, name, arg)),
          Stk.Instr("ref", [Stk.Var(B.asVar(exp.target).name)]),
          Stk.Instr(applyMode, [Stk.Int(BigInt(exp.args.length))]),
        ]
      } else if (exp.args.length === arity) {
        return [
          ...exp.args.flatMap((arg) => onExp(state, name, arg)),
          Stk.Instr(callMode, [Stk.Var(B.asVar(exp.target).name)]),
        ]
      } else {
        return [
          ...exp.args.slice(0, arity).flatMap((arg) => onExp(state, name, arg)),
          Stk.Instr("call", [Stk.Var(B.asVar(exp.target).name)]),
          ...exp.args.slice(arity).flatMap((arg) => onExp(state, name, arg)),
          Stk.Instr(applyMode, [Stk.Int(BigInt(exp.args.length - arity))]),
        ]
      }
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        ...exp.args.flatMap((arg) => onExp(state, name, arg)),
        Stk.Instr("global-load", [Stk.Var(B.asVar(exp.target).name)]),
        Stk.Instr(applyMode, [Stk.Int(BigInt(exp.args.length))]),
      ]
    }
  }
}
