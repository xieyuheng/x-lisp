import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFloat(mod: Mod) {
  definePrimitiveFunction(mod, "float?", 1, (value) => {
    return Values.Bool(Values.isFloat(value))
  })

  definePrimitiveFunction(mod, "fneg", 1, (x) => {
    return Values.Float(-Values.asFloat(x).content)
  })

  definePrimitiveFunction(mod, "fadd", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content + Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "fsub", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content - Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "fmul", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content + Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "fdiv", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content / Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "float-larger?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content > Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "float-smaller?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content < Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "float-larger-or-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content >= Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "float-smaller-or-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content <= Values.asFloat(y).content)
  })
}
