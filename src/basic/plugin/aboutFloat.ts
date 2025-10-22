import * as Values from "../value/index.ts"
import { pluginDefineFunction, type Plugin } from "./index.ts"

export function aboutFloat(plugin: Plugin) {
  pluginDefineFunction(plugin, "float-positive?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content > 0)
  })

  pluginDefineFunction(plugin, "float-non-negative?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content >= 0)
  })

  pluginDefineFunction(plugin, "float-non-zero?", 1, (x) => {
    return Values.Bool(Values.isFloat(x) && Values.asFloat(x).content !== 0)
  })

  pluginDefineFunction(plugin, "fneg", 1, (x) => {
    return Values.Float(-Values.asFloat(x).content)
  })

  pluginDefineFunction(plugin, "fadd", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content + Values.asFloat(y).content)
  })

  pluginDefineFunction(plugin, "fsub", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content - Values.asFloat(y).content)
  })

  pluginDefineFunction(plugin, "fmul", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content * Values.asFloat(y).content)
  })

  pluginDefineFunction(plugin, "fdiv", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content / Values.asFloat(y).content)
  })

  pluginDefineFunction(plugin, "float-max", 2, (x, y) => {
    return Values.Float(
      Math.max(Values.asFloat(x).content, Values.asFloat(y).content),
    )
  })

  pluginDefineFunction(plugin, "float-min", 2, (x, y) => {
    return Values.Float(
      Math.min(Values.asFloat(x).content, Values.asFloat(y).content),
    )
  })

  pluginDefineFunction(plugin, "float-greater?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content > Values.asFloat(y).content)
  })

  pluginDefineFunction(plugin, "float-less?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content < Values.asFloat(y).content)
  })

  pluginDefineFunction(plugin, "float-greater-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content >= Values.asFloat(y).content)
  })

  pluginDefineFunction(plugin, "float-less-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content <= Values.asFloat(y).content)
  })
}
