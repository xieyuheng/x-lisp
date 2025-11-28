import { type Definition } from "../definition/index.ts"
import { formatBlock } from "./formatBlock.ts"
import { formatDirective } from "./formatDirective.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blocks = Array.from(
        definition.blocks.values().map(formatBlock),
      ).join(" ")
      return `(define-code ${definition.name} ${blocks})`
    }

    case "DataDefinition": {
      const directives = Array.from(
        definition.directives.map(formatDirective),
      ).join(" ")
      return `(define-data ${definition.name} ${directives})`
    }

    case "SpaceDefinition": {
      return `(define-space ${definition.name} ${definition.size})`
    }
  }
}
