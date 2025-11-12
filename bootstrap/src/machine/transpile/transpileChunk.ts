import type { Chunk } from "../chunk/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Directive } from "../directive/index.ts"
import { transpileIdentifier } from "./transpileIdentifier.ts"

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
      return `.byte ${values}`
    }

    case "Dw": {
      const values = directive.values.map(String).join(" ")
      return `.word ${values}`
    }

    case "Dd": {
      const values = directive.values.map(String).join(" ")
      return `.long ${values}`
    }

    case "Dq": {
      const values = directive.values.map(String).join(" ")
      return `.quad ${values}`
    }

    case "String": {
      return `.ascii ${directive.content}`
    }
  }
}
