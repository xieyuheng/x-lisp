import type { Chunk } from "../chunk/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Directive } from "../directive/index.ts"
import { transpileIdentifier } from "./transpileIdentifier.ts"

const indentation = " ".repeat(8)

type Context = {
  definition: Definitions.DataDefinition
}

export function transpileChunk(context: Context, chunk: Chunk): string {
  const name = transpileIdentifier([context.definition.name, chunk.label])
  const directives = chunk.directives
    .map((directive) => transpileDirective(context, directive))
    .join("\n")
  return `${name}:\n${directives}`
}

function transpileDirective(context: Context, directive: Directive): string {
  switch (directive.kind) {
    case "Db": {
      const values = directive.values.map(String).join(" ")
      return `${indentation}.byte ${values}`
    }

    case "Dw": {
      const values = directive.values.map(String).join(" ")
      return `${indentation}.word ${values}`
    }

    case "Dd": {
      const values = directive.values.map(String).join(" ")
      return `${indentation}.long ${values}`
    }

    case "Dq": {
      const values = directive.values.map(String).join(" ")
      return `${indentation}.quad ${values}`
    }

    case "String": {
      const content = JSON.stringify(directive.content)
      return `${indentation}.ascii ${content}`
    }
  }
}
