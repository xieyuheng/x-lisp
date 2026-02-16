import { type Definition } from "../definition/index.ts"
import { formatBody } from "./formatExp.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      return `(declare-primitive-function ${definition.name} ${definition.arity})`
    }

    case "PrimitiveVariableDefinition": {
      return `(declare-primitive-variable ${definition.name})`
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

    case "DatatypeDefinition": {
      return `(define-datatype TODO)`
    }
  }
}
