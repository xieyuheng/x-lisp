import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { define } from "./index.ts"

export function definePrimitiveFunction(
  mod: Mod,
  name: string,
  arity: number,
  fn: Values.ValueFunction,
): void {
  define(mod, name, Values.PrimitiveFunction(name, arity, fn))
}

export function definePrimitiveNullaryFunction(
  mod: Mod,
  name: string,
  fn: Values.ValueNullaryFunction,
): void {
  define(mod, name, Values.PrimitiveNullaryFunction(name, fn))
}
