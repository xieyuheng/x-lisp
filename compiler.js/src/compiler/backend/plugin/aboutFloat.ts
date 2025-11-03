import * as Values from "../value/index.ts"
import { definePrimitiveFunction, type Plugin } from "./index.ts"

export function aboutFloat(plugin: Plugin) {
  definePrimitiveFunction(plugin, "float-positive?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content > 0)
  })

  definePrimitiveFunction(plugin, "float-non-negative?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content >= 0)
  })

  definePrimitiveFunction(plugin, "float-non-zero?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content !== 0)
  })

  definePrimitiveFunction(plugin, "fneg", 1, (x) => {
    return Values.Float(-Values.asFloat(x).content)
  })

  definePrimitiveFunction(plugin, "fadd", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content + Values.asFloat(y).content)
  })

  definePrimitiveFunction(plugin, "fsub", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content - Values.asFloat(y).content)
  })

  definePrimitiveFunction(plugin, "fmul", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content * Values.asFloat(y).content)
  })

  definePrimitiveFunction(plugin, "fdiv", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content / Values.asFloat(y).content)
  })

  definePrimitiveFunction(plugin, "float-max", 2, (x, y) => {
    return Values.Float(
      Math.max(Values.asFloat(x).content, Values.asFloat(y).content),
    )
  })

  definePrimitiveFunction(plugin, "float-min", 2, (x, y) => {
    return Values.Float(
      Math.min(Values.asFloat(x).content, Values.asFloat(y).content),
    )
  })

  definePrimitiveFunction(plugin, "float-greater?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content > Values.asFloat(y).content)
  })

  definePrimitiveFunction(plugin, "float-less?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content < Values.asFloat(y).content)
  })

  definePrimitiveFunction(plugin, "float-greater-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content >= Values.asFloat(y).content)
  })

  definePrimitiveFunction(plugin, "float-less-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content <= Values.asFloat(y).content)
  })
}
