import * as M from "../index.ts"
import { recordMapValue } from "@xieyuheng/helpers.js/record"

export function definitionDesugar(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition": {
      definition.body = M.desugar(definition.mod, definition.body)
      return null
    }

    case "VariableDefinition": {
      definition.body = M.desugar(definition.mod, definition.body)
      return null
    }

    case "TestDefinition": {
      definition.body = M.desugar(definition.mod, definition.body)
      return null
    }

    case "TypeDefinition": {
      definition.body = M.desugar(definition.mod, definition.body)
      return null
    }

    case "DataDefinition": {
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields }) => ({
          definition,
          name,
          fields: fields.map(({ name, type }) => ({
            name,
            type: M.desugar(definition.mod, type),
          })),
        }),
      )

      return null
    }

    case "InterfaceDefinition": {
      definition.attributeTypes = recordMapValue(
        definition.attributeTypes,
        (attributeType) => M.desugar(definition.mod, attributeType),
      )

      return null
    }
  }
}
