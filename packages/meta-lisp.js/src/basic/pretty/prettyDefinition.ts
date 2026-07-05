import * as Ppml from "@xieyuheng/ppml.js"
import type { Block } from "../block/index.ts"
import { type Definition } from "../definition/index.ts"
import { formatDefinition } from "../format/formatDefinition.ts"
import { prettyInstr } from "./prettyInstr.ts"

export function prettyDefinition(definition: Definition): Ppml.Node {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return Ppml.text(formatDefinition(definition))
    }

    case "PrimitiveVariableDeclaration": {
      return Ppml.text(formatDefinition(definition))
    }

    case "FunctionDefinition": {
      const name = definition.name
      const paramNodes = definition.parameters.map(Ppml.text)
      const defNode = Ppml.prettyApplication([Ppml.text(name), ...paramNodes])
      const blockNodes = Array.from(definition.blocks.values().map(prettyBlock))
      return Ppml.prettyVertical("define-function", [defNode], blockNodes)
    }

    case "VariableDefinition": {
      const name = definition.name
      const blockNodes = Array.from(definition.blocks.values().map(prettyBlock))
      return Ppml.prettyVertical(
        "define-variable",
        [Ppml.text(name)],
        blockNodes,
      )
    }

    case "TestDefinition": {
      const name = definition.name
      const blockNodes = Array.from(definition.blocks.values().map(prettyBlock))
      return Ppml.prettyVertical("define-test", [Ppml.text(name)], blockNodes)
    }
  }
}

function prettyBlock(block: Block): Ppml.Node {
  const instrNodes = block.instrs.map(prettyInstr)
  return Ppml.prettyVertical("block", [Ppml.text(block.label)], instrNodes)
}
