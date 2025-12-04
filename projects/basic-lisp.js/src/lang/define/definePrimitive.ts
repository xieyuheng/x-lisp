import * as Definitions from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"

export function definePrimitiveFunctionWithContext(
  mod: Mod,
  name: string,
  arity: number,
): void {
  mod.definitions.set(
    name,
    Definitions.PrimitiveFunctionDefinition(mod, name, arity),
  )
}

export function definePrimitiveFunction(
  mod: Mod,
  name: string,
  arity: number,
): void {
  mod.definitions.set(
    name,
    Definitions.PrimitiveFunctionDefinition(mod, name, arity),
  )
}
