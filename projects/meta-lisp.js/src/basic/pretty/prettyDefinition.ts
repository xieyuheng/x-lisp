import * as Ppml from "@xieyuheng/ppml.js"
import type { Block } from "../block/index.ts"
import { type Definition } from "../definition/index.ts"
import { prettyApplication, prettySyntax, prettyText } from "./layout.ts"
import { prettyInstr } from "./prettyInstr.ts"

export function prettyDefinition(definition: Definition): Ppml.Node {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return prettySyntax(
        "declare-primitive-function",
        [],
        [prettyText(definition.name), prettyText(definition.arity.toString())],
      )
    }

    case "PrimitiveVariableDeclaration": {
      return prettySyntax(
        "declare-primitive-variable",
        [],
        [prettyText(definition.name)],
      )
    }

    case "FunctionDefinition": {
      const name = definition.name
      const paramNodes = definition.parameters.map(Ppml.text)
      const defNode = prettyApplication([Ppml.text(name), ...paramNodes])
      const blockNodes = Array.from(definition.blocks.values().map(prettyBlock))
      return prettySyntax("define-function", [defNode], blockNodes)
    }

    case "VariableDefinition": {
      const name = definition.name
      const blockNodes = Array.from(definition.blocks.values().map(prettyBlock))
      return prettySyntax("define-variable", [prettyText(name)], blockNodes)
    }

    case "TestDefinition": {
      const name = definition.name
      const blockNodes = Array.from(definition.blocks.values().map(prettyBlock))
      return prettySyntax("define-test", [prettyText(name)], blockNodes)
    }
  }
}

function prettyBlock(block: Block): Ppml.Node {
  const instrNodes = block.instrs.map(prettyInstr)
  return prettySyntax("block", [prettyText(block.label)], instrNodes)
}
