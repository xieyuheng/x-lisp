import { definePrimitiveFunction, provide } from "../define/index.ts"
import * as L from "../index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinValue(mod: Mod) {
  provide(mod, ["same?", "equal?", "any?"])

  definePrimitiveFunction(mod, "same?", 2, (lhs, rhs) => {
    return Values.BoolValue(L.valueSame(lhs, rhs))
  })

  definePrimitiveFunction(mod, "equal?", 2, (lhs, rhs) => {
    return Values.BoolValue(L.valueEqual(lhs, rhs))
  })

  definePrimitiveFunction(mod, "any?", 1, (value) => {
    return Values.BoolValue(true)
  })
}
