import * as M from "../index.ts"

export function definitionVarTypes(
  definition: M.Definition,
): Map<string, M.Type> | undefined {
  switch (definition.kind) {
    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition":
      return definition.varTypes
    default:
      return undefined
  }
}

export function definitionHasVarTypes(definition: M.Definition): boolean {
  switch (definition.kind) {
    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition":
      return definition.varTypes.size > 0
    default:
      return false
  }
}

export function definitionPutVarTypes(
  definition: M.Definition,
  varTypes: Map<string, M.Type>,
): void {
  switch (definition.kind) {
    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      definition.varTypes = varTypes
      return
    }
    default: {
      throw new Error(
        `[definitionPutVarTypes] unexpected definition kind: ${definition.kind}`,
      )
    }
  }
}
