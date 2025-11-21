import { type Definition } from "../definition/index.ts"
import { formatBlock } from "./formatBlock.ts"
import { formatChunk } from "./formatChunk.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blocks = Array.from(
        definition.blocks.values().map(formatBlock),
      ).join(" ")
      return `(define-code ${definition.name} ${blocks})`
    }

    case "DataDefinition": {
      const blocks = Array.from(
        definition.chunks.values().map(formatChunk),
      ).join(" ")
      return `(define-data ${definition.name} ${blocks})`
    }
  }
}
