import * as B from "../basic/index.ts"
import * as L from "../lisp/index.ts"

export function ExplicateControlPass(mod: L.Mod, basicMod: B.Mod): void {
  for (const stmt of mod.stmts) {
    if (L.isAboutModule(stmt)) {
      basicMod.stmts.push(stmt)
    }
  }

  for (const definition of L.modOwnDefinitions(mod)) {
    basicMod.stmts.push(...onDefinition(basicMod, definition))
  }
}

function onDefinition(
  basicMod: B.Mod,
  definition: L.Definition,
): Array<B.Stmt> {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return []
    }

    case "FunctionDefinition": {
      const state = createState()
      const block = B.Block("entry", [])
      addBlock(state, block)
      block.instrs = inTail(state, definition.body)
      return [
        B.DefineFunction(
          basicMod,
          definition.name,
          definition.parameters,
          state.blocks,
        ),
      ]
    }

    case "VariableDefinition": {
      const state = createState()
      const block = B.Block("entry", [])
      addBlock(state, block)
      block.instrs = inTail(state, definition.body)
      return [B.DefineVariable(basicMod, definition.name, state.blocks)]
    }
  }
}

type State = {
  blocks: Map<string, B.Block>
}

function createState(): State {
  return { blocks: new Map() }
}

function addBlock(state: State, block: B.Block): void {
  state.blocks.set(block.label, block)
}

function inTail(state: State, exp: L.Exp): Array<B.Instr> {
  return []
}
