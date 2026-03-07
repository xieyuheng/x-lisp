import { type Definition } from "../definition/index.ts"
import * as L from "../index.ts"
import { formatBody, formatExp } from "./formatExp.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      return `(declare-primitive-function ${definition.name} ${definition.arity})`
    }

    case "PrimitiveVariableDefinition": {
      return `(declare-primitive-variable ${definition.name})`
    }

    case "FunctionDefinition": {
      const name = definition.name
      const parameters = definition.parameters.join(" ")
      const body = formatBody(definition.body)
      const claimedEntry = L.modLookupClaimedEntry(
        definition.mod,
        definition.name,
      )
      if (claimedEntry) {
        return [
          `(claim ${name} ${formatExp(claimedEntry.exp)})`,
          `(define (${name} ${parameters}) ${body})`,
        ].join("\n")
      } else {
        return `(define (${name} ${parameters}) ${body})`
      }
    }

    case "VariableDefinition": {
      const name = definition.name
      const body = formatBody(definition.body)
      const claimedEntry = L.modLookupClaimedEntry(
        definition.mod,
        definition.name,
      )
      if (claimedEntry) {
        return [
          `(claim ${name} ${formatExp(claimedEntry.exp)})`,
          `(define ${name} ${body})`,
        ].join("\n")
      } else {
        return `(define ${name} ${body})`
      }
    }

    case "TypeDefinition": {
      const name = definition.name
      const body = formatBody(definition.body)
      return `(define-type ${name} ${body})`
    }

    case "DatatypeDefinition": {
      const dataConstructors = definition.dataConstructors
        .map(formatDataConstructor)
        .join(" ")
      if (definition.datatypeConstructor.parameters.length === 0) {
        return `(define-datatype ${definition.name} ${dataConstructors})`
      } else {
        const parameters = definition.datatypeConstructor.parameters.join(" ")
        return `(define-datatype (${definition.name} ${parameters}) ${dataConstructors})`
      }
    }
  }
}

function formatDataConstructor(dataConstructor: L.DataConstructorSpec): string {
  const fields = dataConstructor.fields
    .map((field) => `(${field.name} ${formatExp(field.type)})`)
    .join(" ")
  if (dataConstructor.fields.length === 0) {
    return `${dataConstructor.name}`
  } else {
    return `(${dataConstructor.name} ${fields})`
  }
}
