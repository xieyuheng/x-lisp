import * as Definitions from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"

export function definePrimitive(
  mod: Mod,
  name: string,
  options: { arity: number },
): void {
  mod.definitions.set(
    name,
    Definitions.PrimitiveDefinition(mod, name, options.arity),
  )
}
