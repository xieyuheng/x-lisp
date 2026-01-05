import * as Definitions from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"

export function declarePrimitiveFunction(
  mod: Mod,
  name: string,
  options: { arity: number },
): void {
  mod.definitions.set(
    name,
    Definitions.PrimitiveFunctionDefinition(mod, name, options.arity),
  )
}

export function declarePrimitiveConstant(mod: Mod, name: string): void {
  mod.definitions.set(name, Definitions.PrimitiveConstantDefinition(mod, name))
}
