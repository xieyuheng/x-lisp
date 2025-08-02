import { modSet, type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function definePrimFn(
  mod: Mod,
  name: string,
  arity: number,
  fn: Values.ValueFn,
): void {
  const value = Values.PrimFn(name, arity, fn)
  modSet(mod, name, { mod, name, value })
}
