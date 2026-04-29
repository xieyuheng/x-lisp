import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as M from "../index.ts"

export function QualifyPass(mod: M.Mod): void {
  M.modForEachOwnDefinition(mod, qualifyDefinition)
}

function qualifyDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition": {
      definition.body = M.qualifyFreeVar(
        definition.mod,
        new Set(definition.parameters),
        definition.body,
      )
      return null
    }

    case "VariableDefinition": {
      definition.body = M.qualifyFreeVar(
        definition.mod,
        new Set(),
        definition.body,
      )
      return null
    }

    case "TestDefinition": {
      definition.body = M.qualifyFreeVar(
        definition.mod,
        new Set(),
        definition.body,
      )
      return null
    }

    case "TypeDefinition": {
      definition.body = M.qualifyFreeVar(
        definition.mod,
        new Set(definition.parameters),
        definition.body,
      )
      return null
    }

    case "DataDefinition": {
      const boundNames = new Set(definition.dataTypeConstructor.parameters)
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields }) => ({
          definition,
          name,
          fields: fields.map(({ name, type }) => ({
            name,
            type: M.qualifyFreeVar(definition.mod, boundNames, type),
          })),
        }),
      )

      return null
    }

    case "InterfaceDefinition": {
      const boundNames = new Set(definition.interfaceConstructor.parameters)
      definition.attributeTypes = recordMapValue(
        definition.attributeTypes,
        (attributeType) =>
          M.qualifyFreeVar(definition.mod, boundNames, attributeType),
      )

      return null
    }
  }
}
