import type { Definition } from "../definition/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import { modMapDefinition, type Mod } from "../mod/index.ts"

export function revealFunction(mod: Mod): Mod {
  return modMapDefinition(mod, (definition) =>
    revealDefinition(mod, definition),
  )
}

function revealDefinition(mod: Mod, definition: Definition): Definition {
  switch (definition.kind) {
    case "FunctionDefinition": {
      return Definitions.FunctionDefinition(
        definition.name,
        definition.parameters,
        revealExp(mod, new Set(definition.parameters), definition.body),
        definition.meta,
      )
    }
  }
}

function revealExp(mod: Mod, boundNames: Set<string>, exp: Exp): Exp {
  switch (exp.kind) {
    default: {
      return exp
    }
  }
}
