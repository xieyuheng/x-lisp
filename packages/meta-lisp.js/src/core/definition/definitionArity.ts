import * as S from "@xieyuheng/sexp.js"
import { type Definition } from "./Definition.ts"

export function definitionArity(definition: Definition): number {
  switch (definition.kind) {
    case "FunctionDefinition": {
      return definition.parameters.length
    }

    case "PrimitiveFunctionDeclaration": {
      return definition.arity
    }

    case "TestDefinition": {
      return 0
    }

    default: {
      let message = `[definitionArity] unhandled definition`
      throw new S.ErrorWithSourceLocation(message, definition.location)
    }
  }
}
