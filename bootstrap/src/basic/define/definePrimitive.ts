import * as Definitions from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

export function definePrimitiveFunction(
  mod: Mod,
  name: string,
  arity: number,
  fn: (...args: Array<Value>) => Value,
): void {
  mod.definitions.set(
    name,
    Definitions.PrimitiveFunctionDefinition(mod, name, arity, (context) => fn),
  )
}
