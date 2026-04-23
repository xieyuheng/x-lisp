import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as M from "../index.ts"

export function definitionLocateSpecialApply(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition": {
      definition.body = M.locateSpecialApply(definition.body)
      return null
    }

    case "VariableDefinition": {
      definition.body = M.locateSpecialApply(definition.body)
      return null
    }

    case "TestDefinition": {
      definition.body = M.locateSpecialApply(definition.body)
      return null
    }

    case "TypeDefinition": {
      definition.body = M.locateSpecialApply(definition.body)
      return null
    }

    case "DataDefinition": {
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields }) => ({
          definition,
          name,
          fields: fields.map(({ name, type }) => ({
            name,
            type: M.locateSpecialApply(type),
          })),
        }),
      )

      return null
    }

    case "InterfaceDefinition": {
      definition.attributeTypes = recordMapValue(
        definition.attributeTypes,
        (attributeType) => M.locateSpecialApply(attributeType),
      )

      return null
    }
  }
}
