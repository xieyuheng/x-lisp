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

    case "FunctionDefinition": {
      const name = definition.name
      const instrs = definition.instrs.map(formatInstr).join(" ")
      return `(define-function ${name} ${definition.arity} ${instrs})`
    }

    case "VariableDefinition": {
      const name = definition.name
      const instrs = definition.instrs.map(formatInstr).join(" ")
      return `(define-variable ${name} ${instrs})`
    }

    case "TestDefinition": {
      const name = definition.name
      const instrs = definition.instrs.map(formatInstr).join(" ")
      return `(define-test ${name} ${instrs})`
    }
  }
}
