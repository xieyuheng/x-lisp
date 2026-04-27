import { definePrimitiveFunction } from "../define/index.ts"
import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinValue(mod: Mod) {
  definePrimitiveFunction(mod, "atom?", 1, (value) => {
    return Values.BoolValue(M.isAtomValue(value))
  })

  definePrimitiveFunction(mod, "same?", 2, (lhs, rhs) => {
    return Values.BoolValue(M.valueSame(lhs, rhs))
  })

  definePrimitiveFunction(mod, "equal?", 2, (lhs, rhs) => {
    return Values.BoolValue(M.valueEqual(lhs, rhs))
  })
}
