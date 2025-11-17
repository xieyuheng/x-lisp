import * as S from "@xieyuheng/x-sexp.js"
import * as M from "../../machine/index.ts"

export function PatchInstructionPass(mod: M.Mod): void {
  for (const definition of M.modDefinitions(mod)) {
    onDefinition(definition)
  }
}

function onDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "CodeDefinition": {
      // const blocks = Array.from(definition.blocks.values())
      // for (const block of blocks) {
      //   const locationMap = createLocationMap(definition)
      //   const context: Context = { locationMap }
      //   definition.blocks.set(block.label, onBlock(context, block))
      // }

      return null
    }

    case "DataDefinition": {
      return null
    }
  }
}
