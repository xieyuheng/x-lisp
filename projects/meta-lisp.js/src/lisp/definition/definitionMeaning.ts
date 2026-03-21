import * as L from "../index.ts"

export function definitionMeaning(definition: L.Definition): L.Value {
  L.definitionCheck(definition)

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
        definition.value = L.evaluate(
          definition.mod,
          L.emptyEnv(),
          definition.body,
        )
      }

      return definition.value
    }

    case "DataDefinition": {
      if (definition.dataTypeConstructor.parameters.length === 0) {
        return L.createDataType(definition, [])
      } else {
        return L.DefinitionValue(definition)
      }
    }

    case "InterfaceDefinition": {
      if (definition.interfaceConstructor.parameters.length === 0) {
        return L.createInterfaceType({})
      } else {
        return L.DefinitionValue(definition)
      }
    }
  }
}
