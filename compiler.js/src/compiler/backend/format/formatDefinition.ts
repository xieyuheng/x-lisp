import { type Definition } from "../definition/index.ts"
import { formatBlock } from "./formatBlock.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const head = [definition.name, ...definition.parameters].join(" ")
      const blocks = Array.from(
        definition.blocks.values().map(formatBlock),
      ).join(" ")
      return `(define-function (${head}) ${blocks})`
    }

    case "PrimitiveFunctionDefinition": {
      return `(define-primitive ${definition.name} ${definition.arity})`
    }
  }
}
