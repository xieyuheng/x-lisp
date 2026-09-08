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

    case "VariableDeclaration": {
      return Ppml.text(formatDefinition(definition))
    }

    case "FunctionDefinition": {
      const parametersText = definition.parameters.join(" ")
      const signature = parametersText
        ? `(${definition.name} ${parametersText})`
        : `(${definition.name})`
      const instrNodes = definition.instrs.map(prettyInstr)
      return Ppml.prettyVertical(
        "define-function",
        [Ppml.text(signature)],
        instrNodes,
      )
    }
  }
}
