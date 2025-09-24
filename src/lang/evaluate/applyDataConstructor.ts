import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"

export function applyDataConstructor(
  constructor: Values.DataConstructor,
  args: Array<Value>,
): Value {
  return Values.Data(constructor, args)
}
