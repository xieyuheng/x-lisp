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
      assert(definition.value)
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
