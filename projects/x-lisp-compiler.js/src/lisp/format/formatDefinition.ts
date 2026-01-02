import { type Definition } from "../definition/index.ts"
import { formatBody } from "./formatExp.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const name = definition.name
      const parameters = definition.parameters.join(" ")
      const body = formatBody(definition.body)
      return `(define (${name} ${parameters}) ${body})`
    }

    case "ConstantDefinition": {
      const name = definition.name
      const body = formatBody(definition.body)
      return `(define ${name} ${body})`
    }
  }
}
