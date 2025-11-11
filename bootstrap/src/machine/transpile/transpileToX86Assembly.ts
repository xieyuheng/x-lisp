import type { Definition } from "../definition/index.ts"
import * as Definitions from "../definition/index.ts"
import { modDefinitions, type Mod } from "../mod/index.ts"

export function transpileToX86Assembly(mod: Mod): string {
  const definitions = modDefinitions(mod).map(transpileDefinition).join("\n")
  return definitions
}

type Context = {
  definition: Definitions.CodeDefinition
}

function transpileDefinition(definition: Definition): string {
  return ``
}
