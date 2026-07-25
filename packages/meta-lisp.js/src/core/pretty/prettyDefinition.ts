import * as Ppml from "@xieyuheng/ppml.js"
import { type Definition } from "../definition/Definition.ts"
import { prettyTerm } from "./prettyTerm.ts"

export function prettyDefinition(definition: Definition): Array<Ppml.Node> {
  return [nodeForDefinition(definition)]
}

function nodeForDefinition(definition: Definition): Ppml.Node {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return Ppml.text(
        `(declare-primitive-function ${definition.name} ${definition.arity.toString()})`,
      )
    }

    case "PrimitiveVariableDeclaration": {
      return Ppml.text(`(declare-primitive-variable ${definition.name})`)
    }

    case "FunctionDefinition": {
      const name = definition.name
      const paramNodes = definition.parameters.map(Ppml.text)
      const defNode = Ppml.prettyApplication([Ppml.text(name), ...paramNodes])
      const body = [prettyTerm(definition.body)]
      return Ppml.prettySyntax("define", [defNode], body)
    }

    case "VariableDefinition": {
      const name = definition.name
      const body = [prettyTerm(definition.body)]
      return Ppml.prettySyntax("define", [Ppml.text(name)], body)
    }

    case "TestDefinition": {
      const name = definition.name
      const body = [prettyTerm(definition.body)]
      return Ppml.prettySyntax("define-test", [Ppml.text(name)], body)
    }
  }
}
