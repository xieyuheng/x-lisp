import * as L from "../index.ts"

export function meaning(definition: L.Definition): L.Value {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      return L.DefinitionValue(definition)
    }

    case "PrimitiveVariableDefinition": {
      return definition.value
    }

    case "FunctionDefinition": {
      return L.DefinitionValue(definition)
    }

    case "VariableDefinition": {
      if (!definition.value) {
        let message = `[meaning] VariableDefinition not setup`
        message += `\n  name: ${definition.name}`
        throw new Error(message)
      }

      return definition.value
    }

    case "TypeDefinition": {
      if (!definition.value) {
        let message = `[meaning] TypeDefinition not setup`
        message += `\n  name: ${definition.name}`
        throw new Error(message)
      }

      return definition.value
    }

    case "DatatypeDefinition": {
      if (definition.datatypeConstructor.parameters.length === 0) {
        return L.createDatatypeType(definition, [])
      } else {
        return L.DefinitionValue(definition)
      }
    }
  }
}
