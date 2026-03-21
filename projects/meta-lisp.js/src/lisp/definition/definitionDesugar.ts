import { recordMapValue } from "@xieyuheng/helpers.js/record"
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

    case "DataDefinition": {
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields }) => ({
          definition,
          name,
          fields: fields.map(({ name, type }) => ({
            name,
            type: L.desugar(definition.mod, type),
          })),
        }),
      )

      return null
    }

    case "InterfaceDefinition": {
      definition.attributeTypes = recordMapValue(
        definition.attributeTypes,
        (attributeType) => L.desugar(definition.mod, attributeType),
      )

      return null
    }
  }
}
