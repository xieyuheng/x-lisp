import type { Block } from "../block/index.ts"
import type { Definition } from "../definition/index.ts"
import * as Definitions from "../definition/index.ts"
import { modDefinitions, type Mod } from "../mod/index.ts"

export function transpileToX86Assembly(mod: Mod): string {
  const definitions = modDefinitions(mod).map(transpileDefinition).join("\n\n")
  return definitions
}

type Context = {
  definition: Definitions.CodeDefinition
}

function transpileDefinition(definition: Definition): string {
  const context = { definition }
  const blocks = Array.from(definition.blocks.values()).map((block) =>
    transpileBlock(context, block),
  ).join('\n')
  return `${definition.name}:\n${blocks}`
}

function transpileBlock(context: Context, block: Block): string {
  return ``
}
