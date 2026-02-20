import assert from "node:assert"
import * as L from "../index.ts"

export function meaning(definition: L.Definition): L.Value {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      return L.PrimitiveFunctionValue(definition)
    }

    case "PrimitiveVariableDefinition": {
      return definition.value
    }

    case "FunctionDefinition": {
      return L.FunctionValue(definition)
    }

    case "VariableDefinition": {
      if (!definition.value) {
        let message = `[meaning] VariableDefinition has no value`
        message += `\n  name: ${definition.name}`
        throw new Error(message)
      }

      return definition.value
    }

    case "DatatypeDefinition": {
      if (definition.datatypeConstructor.parameters.length === 0) {
        return L.DatatypeValue(definition, [])
      } else {
        return L.DatatypeConstructorValue(definition)
      }
    }
  }
}
