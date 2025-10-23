import * as Values from "../value/index.ts"
import { definePureInstr, type Plugin } from "./index.ts"

export function aboutFloat(plugin: Plugin) {
  definePureInstr(plugin, "float-positive?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content > 0)
  })

  definePureInstr(plugin, "float-non-negative?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content >= 0)
  })

  definePureInstr(plugin, "float-non-zero?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content !== 0)
  })

  definePureInstr(plugin, "fneg", 1, (x) => {
    return Values.Float(-Values.asFloat(x).content)
  })

  definePureInstr(plugin, "fadd", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content + Values.asFloat(y).content)
  })

  definePureInstr(plugin, "fsub", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content - Values.asFloat(y).content)
  })

  definePureInstr(plugin, "fmul", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content * Values.asFloat(y).content)
  })

  definePureInstr(plugin, "fdiv", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content / Values.asFloat(y).content)
  })

  definePureInstr(plugin, "float-max", 2, (x, y) => {
    return Values.Float(
      Math.max(Values.asFloat(x).content, Values.asFloat(y).content),
    )
  })

  definePureInstr(plugin, "float-min", 2, (x, y) => {
    return Values.Float(
      Math.min(Values.asFloat(x).content, Values.asFloat(y).content),
    )
  })

  definePureInstr(plugin, "float-greater?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content > Values.asFloat(y).content)
  })

  definePureInstr(plugin, "float-less?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content < Values.asFloat(y).content)
  })

  definePureInstr(plugin, "float-greater-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content >= Values.asFloat(y).content)
  })

  definePureInstr(plugin, "float-less-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content <= Values.asFloat(y).content)
  })
}
