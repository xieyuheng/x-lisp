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
      const blocks = Array.from(definition.blocks.values())
      for (const block of blocks) {
        definition.blocks.set(block.label, onBlock(block))
      }

      return null
    }

    case "DataDefinition": {
      return null
    }
  }
}

function onBlock(block: M.Block): M.Block {
  return M.Block(
    block.label,
    block.instrs.flatMap(onInstr),
    block.meta,
  )
}

function onInstr(instr: M.Instr): Array<M.Instr> {
  return [instr]
}
