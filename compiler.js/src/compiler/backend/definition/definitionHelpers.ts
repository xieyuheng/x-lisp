import type { Definition } from "./Definition.ts"

export function definitionArity(definition: Definition): number {
  switch (definition.kind) {
    case "FunctionDefinition": {
      return definition.parameters.length
    }

    case "PrimitiveFunctionDefinition": {
      return definition.arity
    }
  }
}
