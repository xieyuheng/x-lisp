import { randomFloat } from "../../helpers/random/randomFloat.ts"
import { randomInt } from "../../helpers/random/randomInt.ts"
import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinRandom(mod: Mod) {
  definePrimitiveFunction(mod, "random-dice", 0, () => {
    return Values.Int(6)
  })

  definePrimitiveFunction(mod, "random-int", 2, (start, end) => {
    return Values.Int(
      randomInt(Values.asInt(start).content, Values.asInt(end).content),
    )
  })

  definePrimitiveFunction(mod, "random-float", 2, (start, end) => {
    return Values.Float(
      randomFloat(Values.asFloat(start).content, Values.asFloat(end).content),
    )
  })
}
