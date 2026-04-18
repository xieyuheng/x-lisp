import { definePrimitiveFunction } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinTuple(mod: Mod) {
  definePrimitiveFunction(mod, "tuple-head", 1, (list) => {
    if (Values.asListValue(list).elements.length === 0) {
      throw new Error("(tuple-head) expect target to be non empty list")
    }

    return Values.asListValue(list).elements[0]
  })

  definePrimitiveFunction(mod, "tuple-tail", 1, (list) => {
    if (Values.asListValue(list).elements.length === 0) {
      throw new Error("(tuple-tail) expect target to be non empty list")
    }

    return Values.ListValue(Values.asListValue(list).elements.slice(1))
  })
}
