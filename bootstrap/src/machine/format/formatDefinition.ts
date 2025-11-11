import { type Definition } from "../definition/index.ts"
import { formatBlock } from "./formatBlock.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blocks = Array.from(
        definition.blocks.values().map(formatBlock),
      ).join(" ")
      return `(define-code ${definition.name} ${blocks})`
    }
  }
}
