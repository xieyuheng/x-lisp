import { define } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function definePrimitiveThunk(
  mod: Mod,
  name: string,
  fn: Values.ValueThunk,
): void {
  define(mod, name, Values.PrimitiveThunk(name, fn))
}
