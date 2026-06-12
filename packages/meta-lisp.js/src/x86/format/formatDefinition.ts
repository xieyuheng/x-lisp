import * as X86 from "../index.ts"
import { formatBlock } from "./formatBlock.ts"

export function formatDefinition(definition: X86.Definition): string {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blocks = definition.blocks.map(formatBlock).join(" ")
      return `(define-code ${definition.name} ${blocks})`
    }
    case "DataDefinition": {
      const fields = X86.formatFields(definition.fields)
      return `(define-data ${definition.name} ${fields})`
    }
    case "MetadataDefinition": {
      const fields = X86.formatFields(definition.fields)
      return `(define-metadata ${definition.target} ${fields})`
    }
    case "StructDefinition": {
      const fields = X86.formatTypeFields(definition.fields)
      return `(define-struct ${definition.name} ${fields})`
    }
    case "SpaceDefinition":
      return `(define-space ${definition.name} ${definition.size})`
  }
}
