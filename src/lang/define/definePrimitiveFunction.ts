import { define } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function definePrimitiveFunction(
  mod: Mod,
  name: string,
  arity: number,
  fn: Values.ValueFunction,
): void {
  define(mod, name, Values.PrimitiveFunction(name, arity, fn))
}
