import { defineValue } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function definePrimFn(
  mod: Mod,
  name: string,
  arity: number,
  fn: Values.ValueFn,
): void {
  defineValue(mod, name, Values.PrimFn(name, arity, fn))
}
