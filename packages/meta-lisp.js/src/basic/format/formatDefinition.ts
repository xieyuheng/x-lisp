import type { Block } from "../block/index.ts"
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
      const parameters = definition.parameters.join(" ")
      const blocks = Array.from(
        definition.blocks.values().map(formatBlock),
      ).join(" ")
      return `(define-function (${name} ${parameters}) ${blocks})`
    }

    case "VariableDefinition": {
      const name = definition.name
      const blocks = Array.from(
        definition.blocks.values().map(formatBlock),
      ).join(" ")
      return `(define-variable ${name} ${blocks})`
    }

    case "TestDefinition": {
      const name = definition.name
      const blocks = Array.from(
        definition.blocks.values().map(formatBlock),
      ).join(" ")
      return `(define-test ${name} ${blocks})`
    }
  }
}

function formatBlock(block: Block): string {
  const instrs = block.instrs.map(formatInstr).join(" ")
  return `(block ${block.label} ${instrs})`
}
