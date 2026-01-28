import { type Definition } from "../definition/index.ts"
import { formatBody } from "./formatExp.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      const name = definition.name
      return `(declare-primitive-function ${name} ${definition.arity})`
    }

    case "PrimitiveVariableDefinition": {
      const name = definition.name
      return `(declare-primitive-variable ${name})`
    }

    case "FunctionDefinition": {
      const name = definition.name
      const parameters = definition.parameters.join(" ")
      const body = formatBody(definition.body)
      return `(define (${name} ${parameters}) ${body})`
    }

    case "VariableDefinition": {
      const name = definition.name
      const body = formatBody(definition.body)
      return `(define ${name} ${body})`
    }
  }
}
