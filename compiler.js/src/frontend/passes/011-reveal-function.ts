import type { Definition } from "../definition/index.ts"
import { modMapDefinition, type Mod } from "../mod/index.ts"

export function revealFunction(mod: Mod): Mod {
  return modMapDefinition(mod, (definition) =>
    revealDefinition(mod, definition),
  )
}

function revealDefinition(mod: Mod, definition: Definition): Definition {
  return definition
}
