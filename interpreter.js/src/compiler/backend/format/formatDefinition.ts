import { type Definition } from "../definition/index.ts"
import { formatBlock } from "./formatBlock.ts"

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
  }
}
