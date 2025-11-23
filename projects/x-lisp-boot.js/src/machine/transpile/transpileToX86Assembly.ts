import type { Definition } from "../definition/index.ts"
import { modDefinitions, type Mod } from "../mod/index.ts"
import { transpileBlock } from "./transpileBlock.ts"
import { transpileChunk } from "./transpileChunk.ts"
import { transpileOwnName } from "./transpileOwnName.ts"

const indentation = " ".repeat(8)

export function transpileToX86Assembly(mod: Mod): string {
  let code = ""

  for (const name of mod.exported) {
    code += `.global ${transpileOwnName([name])}\n`
  }

  for (const definition of modDefinitions(mod)) {
    code += "\n"
    code += transpileDefinition(definition)
    code += "\n"
  }

  return code
}

function transpileDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "CodeDefinition": {
      const name = transpileOwnName([definition.name])
      const blocks = Array.from(definition.blocks.values())
        .map((block) => transpileBlock({ definition }, block))
        .join("\n")
      let code = `.text\n`
      code += `.align 8\n`
      code += `.type ${name}, @function\n`
      code += `${name}:\n`
      code += `${blocks}\n`
      code += `.size ${name}, . - ${name}\n`
      return code
    }

    case "DataDefinition": {
      const name = transpileOwnName([definition.name])
      const chunks = Array.from(definition.chunks.values())
        .map((chunk) => transpileChunk({ definition }, chunk))
        .join("\n")
      let code = `.data\n`
      code += `.align 8\n`
      code += `.type ${name}, @object\n`
      code +=  `${name}:\n`
      code +=  `${chunks}\n`
      code += `.size ${name}, . - ${name}\n`
      return code
    }
  }
}
