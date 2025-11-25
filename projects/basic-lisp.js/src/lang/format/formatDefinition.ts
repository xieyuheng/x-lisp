import { type Definition } from "../definition/index.ts"
import { formatBlock } from "./formatBlock.ts"
import { formatValue } from "./formatValue.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const blocks = Array.from(
        definition.blocks.values().map(formatBlock),
      ).join(" ")
      return `(define-function ${definition.name} ${blocks})`
    }

    case "PrimitiveFunctionDefinition": {
      return `(define-primitive ${definition.name} ${definition.arity})`
    }

    case "VariableDefinition": {
      return `(define-variable ${definition.name} ${formatValue(definition.value)})`
    }
  }
}
