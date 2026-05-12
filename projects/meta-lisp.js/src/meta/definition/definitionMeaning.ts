import * as M from "../index.ts"

export function definitionMeaning(
  definition: M.Definition,
): M.Type | undefined {
  M.definitionCheck(definition)

  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      let message = `[definitionMeaning] can not handle declared primitive function`
      throw new Error(message)
    }

    case "PrimitiveVariableDeclaration": {
      let message = `[definitionMeaning] can not handle declared primitive variable`
      throw new Error(message)
    }

    case "PrimitiveFunctionDefinition": {
      return M.DefinitionType(definition)
    }

    case "PrimitiveVariableDefinition": {
      return definition.value
    }

    case "FunctionDefinition": {
      return M.DefinitionType(definition)
    }

    case "TestDefinition": {
      return M.DefinitionType(definition)
    }

    case "TypeDefinition": {
      if (definition.parameters.length === 0) {
        if (!definition.value) {
          definition.value = M.typeEvaluate(
            definition.mod,
            M.typeEnvEmpty(),
            definition.body,
          )
        }

        return definition.value
      } else {
        return M.DefinitionType(definition)
      }
    }

    case "VariableDefinition": {
      return undefined
    }

    case "AlgebraicTypeDefinition": {
      if (definition.typeConstructor.parameters.length === 0) {
        return M.AlgebraicDataType(definition, [])
      } else {
        return M.DefinitionType(definition)
      }
    }
  }
}
