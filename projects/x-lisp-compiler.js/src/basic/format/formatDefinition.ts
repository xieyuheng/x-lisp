import { type Definition } from "../definition/index.ts"
import * as Values from "../value/index.ts"
import { formatBlock } from "./formatBlock.ts"
import { formatMetadataAttributes } from "./formatMetadata.ts"
import { formatValue } from "./formatValue.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const blocks = Array.from(
        definition.blocks.values().map(formatBlock),
      ).join(" ")
      return `(define-function ${definition.name} ${blocks})`
    }

    case "SetupDefinition": {
      const blocks = Array.from(
        definition.blocks.values().map(formatBlock),
      ).join(" ")
      return `(define-setup ${definition.name} ${blocks})`
    }

    case "PrimitiveFunctionDefinition": {
      return `(define-primitive ${definition.name} ${definition.arity})`
    }

    case "VariableDefinition": {
      if (Values.isUndefined(definition.value)) {
        return `(define-variable ${definition.name})`
      } else {
        return `(define-variable ${definition.name} ${formatValue(definition.value)})`
      }
    }

    case "MetadataDefinition": {
      return `(define-metadata ${definition.name} ${formatMetadataAttributes(definition.attributes)})`
    }

    case "PlaceholderDefinition": {
      return `(define-placeholder ${definition.name})`
    }
  }
}
