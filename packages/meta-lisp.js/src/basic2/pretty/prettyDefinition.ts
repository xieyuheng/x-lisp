import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"
import { prettyBlock } from "./prettyBlock.ts"
import { prettyOperand } from "./prettyOperand.ts"
import { prettyType } from "./prettyType.ts"

export function prettyDefinition(definition: B.Definition): Ppml.Node {
  switch (definition.kind) {
    case "StructDefinition": {
      const fieldNodes = Object.entries(definition.fields).map(([name, type]) =>
        Ppml.prettySyntax("", [], [Ppml.text(name), prettyType(type)]),
      )
      return Ppml.prettySyntax(
        "define-struct",
        [Ppml.text(definition.name)],
        fieldNodes,
      )
    }

    case "FunctionDefinition": {
      const blockNodes = definition.blocks.map(prettyBlock)
      return Ppml.prettySyntax(
        "define-function",
        [Ppml.text(definition.name), prettyType(definition.retType)],
        blockNodes,
      )
    }

    case "FunctionDeclaration": {
      return Ppml.prettySyntax(
        "declare-function",
        [],
        [Ppml.text(definition.name), prettyType(definition.type)],
      )
    }

    case "VariableDefinition": {
      const body: Array<Ppml.Node> = [
        Ppml.text(definition.name),
        prettyType(definition.type),
      ]
      if (definition.init !== null) {
        body.push(prettyOperand(definition.init))
      }
      return Ppml.prettySyntax("define-variable", [], body)
    }

    case "VariableDeclaration": {
      return Ppml.prettySyntax(
        "declare-variable",
        [],
        [Ppml.text(definition.name), prettyType(definition.type)],
      )
    }
  }
}
