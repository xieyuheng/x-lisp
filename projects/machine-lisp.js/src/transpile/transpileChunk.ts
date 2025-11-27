import * as M from "../index.ts"
import { transpileOwnName } from "./transpileOwnName.ts"

const indentation = " ".repeat(8)

type Context = {
  definition: M.DataDefinition
}

export function transpileChunk(context: Context, chunk: M.Chunk): string {
  const name = transpileOwnName([context.definition.name, chunk.label])
  const directives = chunk.directives
    .map((directive) => transpileDirective(context, directive))
    .join("\n")
  return `${name}:\n${directives}`
}

function transpileDirective(context: Context, directive: M.Directive): string {
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

    case "Int": {
      return `${indentation}.quad ${directive.content}`
    }

    case "Float": {
      return `${indentation}.double ${directive.content}`
    }
  }
}
