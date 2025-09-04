import { randomInt } from "../../utils/random/randomInt.ts"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutRandom(mod: Mod) {
  provide(mod, ["random-int"])

  definePrimitiveFunction(mod, "random-int", 2, (start, end) => {
    return Values.Int(
      randomInt(Values.asInt(start).content, Values.asInt(end).content),
    )
  })
}
