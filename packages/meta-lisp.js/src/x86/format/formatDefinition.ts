import * as X86 from "../index.ts"
import { formatBlock } from "./formatBlock.ts"
import { formatExp } from "./formatExp.ts"

export function formatDefinition(definition: X86.Definition): string {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blocks = definition.blocks.map(formatBlock).join(" ")
      return `(define-code ${definition.name} ${blocks})`
    }
    case "DataDefinition":
      return `(define-data ${definition.name} ${formatExp(definition.value)})`
    case "MetadataDefinition":
      return `(define-metadata ${definition.target} ${formatExp(definition.value)})`
    case "StructDefinition": {
      const fields = Object.keys(definition.fields)
        .map((name) => `(${name} ${X86.formatType(definition.fields[name])})`)
        .join(" ")
      return `(define-struct ${definition.name} ${fields})`
    }
    case "SpaceDefinition":
      return `(define-space ${definition.name} ${formatExp(definition.size)})`
    case "PrimitiveTypeDefinition":
      return `(declare-primitive-type ${definition.name})`
  }
}
