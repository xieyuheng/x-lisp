import * as B from "../index.ts"

export function definitionArity(definition: B.Definition): number {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return definition.arity
    }

    case "FunctionDefinition": {
      return definition.parameters.length
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition":
    case "TestDefinition": {
      let message = `[definitionArity] unhandled kind: ${definition.kind}\n`
      throw new Error(message)
    }
  }
}
