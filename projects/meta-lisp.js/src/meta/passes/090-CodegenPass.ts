import * as B from "../../basic/index.ts"
import * as L from "../../li/index.ts"

export function CodegenPass(
  basicMod: B.Mod,
  liMod: L.Mod,
  testNames: Set<string>,
): void {
  for (const name of testNames) {
    liMod.lines.push(L.Line("put", `${name}/is-test`, [L.Keyword("true")]))
  }

  for (const definition of basicMod.definitions.values()) {
    if (definition.kind === "VariableDefinition") {
      liMod.lines.push(
        L.Line("put", `${definition.name}/is-variable`, [L.Keyword("true")]),
      )
    }
  }

  for (const definition of basicMod.definitions.values()) {
    liMod.lines.push(...onDefinition(basicMod, definition))
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

function collectLocalIndexes(state: State, definition: B.Definition): void {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      return
    }

    case "FunctionDefinition": {
      for (const parameter of definition.parameters) {
        addLocalIndexes(state, parameter)
      }

      for (const block of definition.blocks.values()) {
        collectLocalIndexesFromBlock(state, block)
      }
    }

    case "VariableDefinition": {
      for (const block of definition.blocks.values()) {
        collectLocalIndexesFromBlock(state, block)
      }
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

function onDefinition(mod: B.Mod, definition: B.Definition): Array<L.Line> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "TestDefinition": {
      return []
    }

    case "FunctionDefinition": {
      const state = createState(mod)
      collectLocalIndexes(state, definition)
      const blocks = definition.blocks.values()
      return [
        L.Line("put", `${definition.name}/arity`, [
          L.Int(BigInt(definition.parameters.length)),
        ]),
        ...definition.parameters
          .toReversed()
          .map((parameter) =>
            L.Line("fn", definition.name, [
              L.Keyword("local-store"),
              L.Int(BigInt(lookupLocalIndex(state, parameter))),
              L.Keyword(parameter),
            ]),
          ),
        ...blocks.flatMap((block) => onBlock(state, definition.name, block)),
      ]
    }

    case "VariableDefinition": {
      const state = createState(mod)
      collectLocalIndexes(state, definition)
      const blocks = definition.blocks.values()
      return [
        ...blocks.flatMap((block) => onBlock(state, definition.name, block)),
      ]
    }
  }
}

function onBlock(state: State, name: string, block: B.Block): Array<L.Line> {
  return [
    L.Line("fn", name, [L.Keyword("label"), L.Keyword(block.label)]),
    ...block.instrs.flatMap((instr) => onInstr(state, name, instr)),
  ]
}

function onInstr(state: State, name: string, instr: B.Instr): Array<L.Line> {
  switch (instr.kind) {
    case "Assign": {
      return [
        ...onExp(state, name, instr.exp),
        L.Line("fn", name, [
          L.Keyword("local-store"),
          L.Int(BigInt(lookupLocalIndex(state, instr.dest))),
          L.Keyword(instr.dest),
        ]),
      ]
    }

    case "Perform": {
      return [
        ...onExp(state, name, instr.exp),
        L.Line("fn", name, [L.Keyword("drop")]),
      ]
    }

    case "Test": {
      return onExp(state, name, instr.exp)
    }

    case "Branch": {
      return [
        L.Line("fn", name, [
          L.Keyword("jump-if-not"),
          L.Keyword(instr.elseLabel),
        ]),
        L.Line("fn", name, [L.Keyword("jump"), L.Keyword(instr.thenLabel)]),
      ]
    }

    case "Goto": {
      return [L.Line("fn", name, [L.Keyword("jump"), L.Keyword(instr.label)])]
    }

    case "Return": {
      return onTailExp(state, name, instr.exp)
    }
  }
}

function onExp(state: State, name: string, exp: B.Exp): Array<L.Line> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [L.Line("fn", name, [L.Keyword("literal"), exp])]
    }

    case "Var": {
      return onVar(state, name, exp)
    }

    case "Apply": {
      return onApply(state, name, exp)
    }
  }
}

function onTailExp(state: State, name: string, exp: B.Exp): Array<L.Line> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [
        L.Line("fn", name, [L.Keyword("literal"), exp]),
        L.Line("fn", name, [L.Keyword("return")]),
      ]
    }

    case "Var": {
      return [
        ...onVar(state, name, exp),
        L.Line("fn", name, [L.Keyword("return")]),
      ]
    }

    case "Apply": {
      return onTailApply(state, name, exp)
    }
  }
}

function onVar(state: State, name: string, exp: B.Var): Array<L.Line> {
  const definition = B.modLookupDefinition(state.mod, exp.name)
  if (definition === undefined) {
    return [
      L.Line("fn", name, [
        L.Keyword("local-load"),
        L.Int(BigInt(lookupLocalIndex(state, exp.name))),
        L.Keyword(exp.name),
      ]),
    ]
  }

  switch (definition.kind) {
    case "TestDefinition": {
      throw new Error()
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      return [L.Line("fn", name, [L.Keyword("ref"), L.Keyword(exp.name)])]
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        L.Line("fn", name, [L.Keyword("global-load"), L.Keyword(exp.name)]),
      ]
    }
  }
}

function onApply(state: State, name: string, exp: B.Apply): Array<L.Line> {
  return onGeneralApply(state, name, exp, false)
}

function onTailApply(state: State, name: string, exp: B.Apply): Array<L.Line> {
  return onGeneralApply(state, name, exp, true)
}

function onGeneralApply(
  state: State,
  name: string,
  exp: B.Apply,
  isTail: boolean,
): Array<L.Line> {
  const applyMode = isTail ? "tail-apply" : "apply"
  const callMode = isTail ? "tail-call" : "call"
  const definition = B.modLookupDefinition(state.mod, B.asVar(exp.target).name)
  if (definition === undefined) {
    return [
      ...exp.args.flatMap((arg) => onExp(state, name, arg)),
      L.Line("fn", name, [
        L.Keyword("local-load"),
        L.Int(BigInt(lookupLocalIndex(state, B.asVar(exp.target).name))),
        L.Keyword(B.asVar(exp.target).name),
      ]),
      L.Line("fn", name, [
        L.Keyword(applyMode),
        L.Int(BigInt(exp.args.length)),
      ]),
    ]
  }

  switch (definition.kind) {
    case "TestDefinition": {
      throw new Error()
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      const arity = B.definitionArity(definition)
      if (exp.args.length < arity) {
        return [
          ...exp.args.flatMap((arg) => onExp(state, name, arg)),
          L.Line("fn", name, [
            L.Keyword("ref"),
            L.Keyword(B.asVar(exp.target).name),
          ]),
          L.Line("fn", name, [
            L.Keyword(applyMode),
            L.Int(BigInt(exp.args.length)),
          ]),
        ]
      } else if (exp.args.length === arity) {
        return [
          ...exp.args.flatMap((arg) => onExp(state, name, arg)),
          L.Line("fn", name, [
            L.Keyword(callMode),
            L.Keyword(B.asVar(exp.target).name),
          ]),
        ]
      } else {
        return [
          ...exp.args.slice(0, arity).flatMap((arg) => onExp(state, name, arg)),
          L.Line("fn", name, [
            L.Keyword("call"),
            L.Keyword(B.asVar(exp.target).name),
          ]),
          ...exp.args.slice(arity).flatMap((arg) => onExp(state, name, arg)),
          L.Line("fn", name, [
            L.Keyword(applyMode),
            L.Int(BigInt(exp.args.length - arity)),
          ]),
        ]
      }
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        ...exp.args.flatMap((arg) => onExp(state, name, arg)),
        L.Line("fn", name, [
          L.Keyword("global-load"),
          L.Keyword(B.asVar(exp.target).name),
        ]),
        L.Line("fn", name, [
          L.Keyword(applyMode),
          L.Int(BigInt(exp.args.length)),
        ]),
      ]
    }
  }
}
