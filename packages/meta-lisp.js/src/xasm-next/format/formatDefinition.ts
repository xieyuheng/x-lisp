import * as N from "../index.ts"
import { formatBlock } from "./formatBlock.ts"

export function formatDefinition(definition: N.Definition): string {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blocks = definition.blocks.map(formatBlock).join(" ")
      return `(define-code ${definition.name} ${blocks})`
    }
    case "DataDefinition": {
      const fields = Array.from(definition.fields.entries())
        .map(([name, value]) => `(${name} ${formatValue(value)})`)
        .join(" ")
      return `(define-data ${definition.name} ${fields})`
    }
    case "MetadataDefinition": {
      const fields = Array.from(definition.fields.entries())
        .map(([name, value]) => `(${name} ${formatValue(value)})`)
        .join(" ")
      return `(define-metadata ${definition.target} ${fields})`
    }
    case "StructDefinition": {
      const fields = Array.from(definition.fields.entries())
        .map(([name, type]) => `(${name} ${formatType(type)})`)
        .join(" ")
      return `(define-struct ${definition.name} ${fields})`
    }
    case "SpaceDefinition":
      return `(define-space ${definition.name} ${definition.size})`
  }
}

function formatValue(value: N.Value): string {
  switch (value.kind) {
    case "IntValue":
      return value.value.toString()
    case "StringValue":
      return JSON.stringify(value.content)
    case "LabelValue":
      if (value.path.length === 0) return `(label ${value.name})`
      return `(label ${[value.name, ...value.path].join(" ")})`
    case "StructValue": {
      const prefix = value.name ? `${value.name} ` : ""
      const fields = Array.from(value.fields.entries())
        .map(([name, v]) => `(${name} ${formatValue(v)})`)
        .join(" ")
      return `(struct ${prefix}${fields})`
    }
    case "PointerValue":
      return `(pointer ${formatValue(value.target)})`
  }
}

function formatType(type: N.Type): string {
  switch (type.kind) {
    case "AtomType":
      return type.name
    case "PointerType":
      return `(pointer-t ${formatType(type.target)})`
    case "NamedType":
      return type.name
  }
}
