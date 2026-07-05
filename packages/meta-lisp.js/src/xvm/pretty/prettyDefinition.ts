import * as Ppml from "@xieyuheng/ppml.js"
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
      const instrNodes = definition.instrs.map(prettyInstr)
      return Ppml.prettyVertical(
        "define-function",
        [Ppml.text(name), Ppml.text(definition.arity.toString())],
        instrNodes,
      )
    }

    case "VariableDefinition": {
      const name = definition.name
      const instrNodes = definition.instrs.map(prettyInstr)
      return Ppml.prettyVertical(
        "define-variable",
        [Ppml.text(name)],
        instrNodes,
      )
    }

    case "TestDefinition": {
      const name = definition.name
      const instrNodes = definition.instrs.map(prettyInstr)
      return Ppml.prettyVertical("define-test", [Ppml.text(name)], instrNodes)
    }
  }
}
