import * as Definitions from "../definition/index.ts"
import { type Mod, modDefine } from "../mod/index.ts"

export function declarePrimitiveFunction(
  mod: Mod,
  name: string,
  options: { arity: number },
): void {
  modDefine(
    mod,
    name,
    Definitions.PrimitiveFunctionDefinition(mod, name, options.arity),
  )
}

export function declarePrimitiveVariable(mod: Mod, name: string): void {
  modDefine(mod, name, Definitions.PrimitiveVariableDefinition(mod, name))
}
