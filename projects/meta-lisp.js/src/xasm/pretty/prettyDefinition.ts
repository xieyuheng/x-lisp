import * as Ppml from "@xieyuheng/ppml.js"
import { type Definition } from "../definition/index.ts"
import { prettySyntax, prettyText } from "./layout.ts"
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
      const instrNodes = definition.instrs.map(prettyInstr)
      return prettySyntax(
        "define-function",
        [prettyText(name), prettyText(definition.arity.toString())],
        instrNodes,
      )
    }

    case "VariableDefinition": {
      const name = definition.name
      const instrNodes = definition.instrs.map(prettyInstr)
      return prettySyntax("define-variable", [prettyText(name)], instrNodes)
    }

    case "TestDefinition": {
      const name = definition.name
      const instrNodes = definition.instrs.map(prettyInstr)
      return prettySyntax("define-test", [prettyText(name)], instrNodes)
    }
  }
}
