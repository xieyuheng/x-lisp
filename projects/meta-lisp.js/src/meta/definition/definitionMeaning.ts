import * as M from "../index.ts"

export function definitionMeaning(definition: M.Definition): M.Value {
  M.definitionCheck(definition)

  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      return M.DefinitionValue(definition)
    }

    case "PrimitiveVariableDefinition": {
      return definition.value
    }

    case "FunctionDefinition": {
      return M.DefinitionValue(definition)
    }

    case "VariableDefinition": {
      if (!definition.value) {
        definition.value = M.evaluate(
          definition.mod,
          M.emptyEnv(),
          definition.body,
        )
      }

      return definition.value
    }

    case "DataDefinition": {
      if (definition.dataTypeConstructor.parameters.length === 0) {
        return M.createDefinedDataType(definition, [])
      } else {
        return M.DefinitionValue(definition)
      }
    }

    case "InterfaceDefinition": {
      if (definition.interfaceConstructor.parameters.length === 0) {
        return M.createDefinedInterfaceType(definition, [])
      } else {
        return M.DefinitionValue(definition)
      }
    }
  }
}
