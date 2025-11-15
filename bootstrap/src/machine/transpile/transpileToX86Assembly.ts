import type { Definition } from "../definition/index.ts"
import { modDefinitions, type Mod } from "../mod/index.ts"
import { transpileBlock } from "./transpileBlock.ts"
import { transpileChunk } from "./transpileChunk.ts"
import { transpileName } from "./transpileName.ts"

const indentation = " ".repeat(8)

export function transpileToX86Assembly(mod: Mod): string {
  let code = ""

  for (const name of mod.exported) {
    code += `.global ${transpileName([name])}\n`
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
      const name = transpileName([definition.name])
      const blocks = Array.from(definition.blocks.values())
        .map((block) => transpileBlock({ definition }, block))
        .join("\n")
      return `.text\n${name}:\n${blocks}`
    }

    case "DataDefinition": {
      const name = transpileName([definition.name])
      const chunks = Array.from(definition.chunks.values())
        .map((chunk) => transpileChunk({ definition }, chunk))
        .join("\n")
      return `.data\n${name}:\n${chunks}`
    }
  }
}
