import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"
import { prettyBlock } from "./prettyBlock.ts"
import { prettyData } from "./prettyData.ts"

export function prettyDefinition(definition: B.Definition): Ppml.Node {
  switch (definition.kind) {
    case "StructDefinition": {
      const fieldNodes = Object.entries(definition.fields).map(([name, type]) =>
        Ppml.text(`(${name} ${B.formatType(type)})`),
      )
      return Ppml.prettySyntax(
        "define-struct",
        [Ppml.text(definition.name)],
        fieldNodes,
      )
    }

    case "FunctionDefinition": {
      const blockNodes = Array.from(definition.blocks.values()).map(prettyBlock)
      return Ppml.prettyVertical(
        "define-function",
        [Ppml.text(definition.name)],
        blockNodes,
      )
    }

    case "VariableDefinition": {
      const body: Array<Ppml.Node> = [Ppml.text(definition.name)]
      if (definition.init !== null) {
        body.push(prettyData(definition.init))
      }
      return Ppml.prettySyntax("define-variable", [], body)
    }

    case "ExternFunctionDefinition": {
      return Ppml.prettySyntax(
        "extern-function",
        [],
        [Ppml.text(definition.name)],
      )
    }

    case "ExternVariableDefinition": {
      return Ppml.prettySyntax(
        "extern-variable",
        [],
        [Ppml.text(definition.name)],
      )
    }
  }
}
