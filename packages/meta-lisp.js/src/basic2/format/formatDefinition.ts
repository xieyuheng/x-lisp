import * as B from "../index.ts"
import { formatBlock } from "./formatBlock.ts"
import { formatExp } from "./formatExp.ts"
import { formatType } from "./formatType.ts"

export function formatDefinition(definition: B.Definition): string {
  switch (definition.kind) {
    case "StructDefinition": {
      const fieldTexts = Object.entries(definition.fields)
        .map(([name, type]) => `(${name} ${formatType(type)})`)
        .join(" ")
      return `(define-struct ${definition.name} ${fieldTexts})`
    }

    case "FunctionDefinition": {
      const blockTexts = definition.blocks.map(formatBlock).join(" ")
      return `(define-function ${definition.name} ${blockTexts})`
    }

    case "VariableDefinition": {
      if (definition.init === null) {
        return `(define-variable ${definition.name})`
      }
      return `(define-variable ${definition.name} ${formatExp(definition.init)})`
    }
  }
}
