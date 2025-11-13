import * as M from "../../machine/index.ts"
import type { Block } from "../block/index.ts"
import type { Definition } from "../definition/index.ts"
import { modOwnDefinitions, type Mod } from "../mod/index.ts"

export function SelectInstructionPass(mod: Mod, machineMod: M.Mod): void {
  for (const definition of modOwnDefinitions(mod)) {
    onDefinition(machineMod, definition)
  }
}

type State = {
  code: M.CodeDefinition
}

function onDefinition(machineMod: M.Mod, definition: Definition): null {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const code = M.CodeDefinition(
        machineMod,
        definition.name,
        new Map(),
        definition.meta,
      )
      const state = { code }
      for (const block of definition.blocks.values()) {
        onBlock(state, block)
      }
      return null
    }

    default: {
      let message = `[onDefinition] unhandled definition`
      message += `\n  definition kind: ${definition.kind}`
      throw new Error(message)
    }
  }
}

function onBlock(state: State, block: Block): void {
  //
}
