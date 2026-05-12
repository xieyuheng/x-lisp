import * as M from "../index.ts"

export function formatDefinition(definition: M.Definition): string {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveFunctionDeclaration": {
      return `(declare-primitive-function ${definition.name} ${definition.arity})`
    }

    case "PrimitiveVariableDefinition":
    case "PrimitiveVariableDeclaration": {
      return `(declare-primitive-variable ${definition.name})`
    }

    case "FunctionDefinition": {
      const name = definition.name
      const parameters = definition.parameters.join(" ")
      const body = M.formatBody(definition.body)
      const type = formatDefinitionType(definition.mod, definition.name)
      if (type) {
        return `${type} (define (${name} ${parameters}) ${body})`
      } else {
        return `(define (${name} ${parameters}) ${body})`
      }
    }

    case "VariableDefinition": {
      const name = definition.name
      const body = M.formatBody(definition.body)
      const type = formatDefinitionType(definition.mod, definition.name)
      if (type) {
        return `${type} (define ${name} ${body})`
      } else {
        return `(define ${name} ${body})`
      }
    }

    case "TestDefinition": {
      const name = definition.name
      const body = M.formatBody(definition.body)
      const type = formatDefinitionType(definition.mod, definition.name)
      if (type) {
        return `${type} (define-test ${name} ${body})`
      } else {
        return `(define-test ${name} ${body})`
      }
    }

    case "TypeDefinition": {
      const name = definition.name
      const body = M.formatBody(definition.body)
      const type = formatDefinitionType(definition.mod, definition.name)
      if (type) {
        return `${type} (define-type ${name} ${body})`
      } else {
        return `(define-type ${name} ${body})`
      }
    }

    case "DataDefinition": {
      const dataConstructors = definition.dataConstructors
        .map(formatDataConstructor)
        .join(" ")
      if (definition.typeConstructor.parameters.length === 0) {
        return `(define-enum ${definition.name} ${dataConstructors})`
      } else {
        const parameters = definition.typeConstructor.parameters.join(" ")
        return `(define-data (${definition.name} ${parameters}) ${dataConstructors})`
      }
    }
  }
}

function formatDataConstructor(dataConstructor: M.DataConstructor): string {
  const fields = dataConstructor.fields
    .map((field) => `(${field.name} ${M.formatExp(field.type)})`)
    .join(" ")
  if (dataConstructor.fields.length === 0) {
    return `${dataConstructor.name}`
  } else {
    return `(${dataConstructor.name} ${fields})`
  }
}

function formatDefinitionType(mod: M.Mod, name: string): string | undefined {
  const claimedEntry = M.modLookupClaimedEntry(mod, name)
  if (claimedEntry) {
    return `(claim ${name} ${M.formatExp(claimedEntry.exp)})`
  }

  const inferredType = M.modLookupInferredType(mod, name)
  if (inferredType) {
    return `(claim ${name} ${M.formatType(inferredType)})`
  }

  return undefined
}
