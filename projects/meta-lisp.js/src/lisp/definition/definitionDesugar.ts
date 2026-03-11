import * as L from "../index.ts"

export function definitionDesugar(definition: L.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition": {
      definition.body = L.desugar(definition.mod, definition.body)
      return null
    }

    case "VariableDefinition": {
      definition.body = L.desugar(definition.mod, definition.body)
      return null
    }

    case "DatatypeDefinition": {
      // TODO
      return null
    }
  }
}
