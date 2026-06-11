import * as Ppml from "@xieyuheng/ppml.js"
import { type Definition } from "../definition/index.ts"
import { prettyInstr } from "./prettyInstr.ts"

export function prettyDefinition(definition: Definition): Ppml.Node {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return Ppml.prettySyntax(
        "declare-primitive-function",
        [],
        [Ppml.text(definition.name), Ppml.text(definition.arity.toString())],
      )
    }

    case "PrimitiveVariableDeclaration": {
      return Ppml.prettySyntax(
        "declare-primitive-variable",
        [],
        [Ppml.text(definition.name)],
      )
    }

    case "FunctionDefinition": {
      const name = definition.name
      const instrNodes = definition.instrs.map(prettyInstr)
      return Ppml.prettySyntax(
        "define-function",
        [Ppml.text(name), Ppml.text(definition.arity.toString())],
        instrNodes,
      )
    }

    case "VariableDefinition": {
      const name = definition.name
      const instrNodes = definition.instrs.map(prettyInstr)
      return Ppml.prettySyntax("define-variable", [Ppml.text(name)], instrNodes)
    }

    case "TestDefinition": {
      const name = definition.name
      const instrNodes = definition.instrs.map(prettyInstr)
      return Ppml.prettySyntax("define-test", [Ppml.text(name)], instrNodes)
    }
  }
}
