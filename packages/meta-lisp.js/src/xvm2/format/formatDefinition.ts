import { type Definition } from "../definition/index.ts"
import { formatInstr } from "./formatInstr.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return `(declare-primitive-function ${definition.name} ${definition.arity})`
    }

    case "PrimitiveVariableDeclaration": {
      return `(declare-primitive-variable ${definition.name})`
    }

    case "VariableDeclaration": {
      return `(declare-variable ${definition.name})`
    }

    case "FunctionDefinition": {
      const parametersText = definition.parameters.join(" ")
      const signature = parametersText
        ? `(${definition.name} ${parametersText})`
        : `(${definition.name})`
      const instrs = definition.instrs.map(formatInstr).join(" ")
      return `(define-function ${signature} ${instrs})`
    }
  }
}
