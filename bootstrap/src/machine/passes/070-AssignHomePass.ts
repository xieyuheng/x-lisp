import { Block } from "../block/index.ts";
import type { Definition } from "../definition/index.ts";
import { Instr } from "../instr/index.js";
import type { Mod } from "../mod/index.ts";
import { modDefinitions } from "../mod/index.ts"
import type { Operand } from "../operand/index.ts";

export function AssignHomePass(mod: Mod): void {
  for (const definition of modDefinitions(mod)) {
    onDefinition(definition)
  }
}

type Context = {
  locationMap: Map<string, Operand>
}

function onDefinition(definition: Definition): null {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blocks = Array.from(definition.blocks.values())
      for (const block of blocks) {
        const locationMap = new Map()
        const context: Context = { locationMap }
        definition.blocks.set(block.label, onBlock(context, block))
      }

      return null
    }

    case "DataDefinition": {
      return null
    }
  }
}

function onBlock(context: Context, block: Block): Block {
  return Block(
    block.label,
    block.instrs.map(instr => onInstr(context, instr)),
    block.meta,
  )
}

function onInstr(context: Context, instr: Instr): Instr {
  return Instr(
    instr.op,
    instr.operands.map(operand => onOperand(context, operand)),
    instr.meta,
  )
}

function onOperand(context: Context, operand: Operand): Operand {
  return operand
}
