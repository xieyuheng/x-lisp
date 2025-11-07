import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinFloat(mod: Mod) {
  definePrimitiveFunction(mod, "float-positive?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content > 0)
  })

  definePrimitiveFunction(mod, "float-non-negative?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content >= 0)
  })

  definePrimitiveFunction(mod, "float-non-zero?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content !== 0)
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
    return Values.Float(Values.asFloat(x).content * Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "fdiv", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content / Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "float-max", 2, (x, y) => {
    return Values.Float(
      Math.max(Values.asFloat(x).content, Values.asFloat(y).content),
    )
  })

  definePrimitiveFunction(mod, "float-min", 2, (x, y) => {
    return Values.Float(
      Math.min(Values.asFloat(x).content, Values.asFloat(y).content),
    )
  })

  definePrimitiveFunction(mod, "float-greater?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content > Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "float-less?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content < Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "float-greater-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content >= Values.asFloat(y).content)
  })

  definePrimitiveFunction(mod, "float-less-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content <= Values.asFloat(y).content)
  })
}
