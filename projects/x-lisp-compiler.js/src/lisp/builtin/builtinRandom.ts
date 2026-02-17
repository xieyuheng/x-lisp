import { randomFloat, randomInt } from "@xieyuheng/helpers.js/random"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinRandom(mod: Mod) {
  provide(mod, ["random-int", "random-float"])

  definePrimitiveFunction(mod, "random-int", 2, (start, end) => {
    return Values.IntValue(
      BigInt(
        randomInt(
          Number(Values.asIntValue(start).content),
          Number(Values.asIntValue(end).content),
        ),
      ),
    )
  })

  definePrimitiveFunction(mod, "random-float", 2, (start, end) => {
    return Values.FloatValue(
      randomFloat(
        Values.asFloatValue(start).content,
        Values.asFloatValue(end).content,
      ),
    )
  })
}
