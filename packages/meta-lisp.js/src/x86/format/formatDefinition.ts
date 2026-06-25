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
      const fields = definition.fields
        .map((f) => `(${f.name} ${formatExp(f.exp)})`)
        .join(" ")
      return `(define-struct ${definition.name} ${fields})`
    }
    case "SpaceDefinition":
      return `(define-space ${definition.name} ${formatExp(definition.size)})`
    case "PrimitiveTypeDefinition": {
      const arity = definition.typeConstructor.parameters.length
      return `(declare-primitive-type ${definition.name} ${arity})`
    }
  }
}
