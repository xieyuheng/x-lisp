import assert from "node:assert"
import type { Definition } from "../definition/index.ts"
import type { Value } from "../value/index.ts"

export function meaning(definition: Definition): Value {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      throw new Error("TODO")
    }

    case "PrimitiveVariableDefinition": {
      return definition.value
    }

    case "FunctionDefinition": {
      throw new Error("TODO")
    }

    case "VariableDefinition": {
      assert(definition.value)
      return definition.value
    }

    case "DatatypeDefinition": {
      throw new Error("TODO")
    }
  }
}
