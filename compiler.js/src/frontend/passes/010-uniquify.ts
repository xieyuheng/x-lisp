import type { Definition } from "../definition/index.ts"
import { modMapDefinition, type Mod } from "../mod/index.ts"

export function uniquify(mod: Mod): Mod {
  return modMapDefinition(mod, uniquifyDefinition)
}

function uniquifyDefinition(definition: Definition): Definition {
  return definition
}
