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

  definePrimitiveFunction(mod, "int-max", 2, (x, y) => {
    return Values.Int(
      Math.max(Values.asInt(x).content, Values.asInt(y).content),
    )
  })

  definePrimitiveFunction(mod, "int-min", 2, (x, y) => {
    return Values.Int(
      Math.min(Values.asInt(x).content, Values.asInt(y).content),
    )
  })

  definePrimitiveFunction(mod, "int-larger?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content > Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "int-smaller?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content < Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "int-larger-or-equal?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content >= Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "int-smaller-or-equal?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content <= Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "int-positive?", 1, (x) => {
    return Values.Bool(Values.asInt(x).content > 0)
  })

  definePrimitiveFunction(mod, "int-non-negative?", 1, (x) => {
    return Values.Bool(Values.asInt(x).content >= 0)
  })
}
