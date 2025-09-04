import { randomRange } from "../../utils/random/randomRange.ts"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutRandom(mod: Mod) {
  provide(mod, ["random-range"])

  definePrimitiveFunction(mod, "random-range", 2, (start, end) => {
    return Values.Int(
      randomRange(Values.asInt(start).content, Values.asInt(end).content),
    )
  })
}
