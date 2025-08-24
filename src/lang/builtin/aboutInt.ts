import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutInt(mod: Mod) {
  definePrimitiveFunction(mod, "int?", 1, (value) => {
    return Values.Bool(Values.isInt(value))
  })

  definePrimitiveFunction(mod, "ineg", 1, (x) => {
    return Values.Int(-Values.asInt(x).content)
  })

  definePrimitiveFunction(mod, "iadd", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content + Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "isub", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content - Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "imul", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content + Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "idiv", 2, (x, y) => {
    return Values.Int(
      Math.trunc(Values.asInt(x).content / Values.asInt(y).content),
    )
  })

  definePrimitiveFunction(mod, "imod", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content % Values.asInt(y).content)
  })
}
