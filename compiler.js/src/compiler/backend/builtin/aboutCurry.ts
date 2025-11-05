import { definePrimitiveFunction } from "../define/index.ts"
import { equal } from "../equal/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutCurry(mod: Mod) {
  definePrimitiveFunction(mod, "make-curry", 3, (target, arity, size) => {
    return Values.Curry(
      target,
      Values.asInt(arity).content,
      Array(size).fill(Values.Null()),
    )
  })

  definePrimitiveFunction(mod, "curry-put!", 3, (index, value, curry) => {
    const { args } = Values.asCurry(curry)
    args[Values.asInt(index).content] = value
    return curry
  })
}
