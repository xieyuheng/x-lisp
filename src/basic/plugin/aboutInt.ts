import * as Values from "../value/index.ts"
import { pluginDefineFunction, type Plugin } from "./index.ts"

export function aboutInt(plugin: Plugin) {
  pluginDefineFunction(plugin, "int-positive?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content > 0)
  })

  pluginDefineFunction(plugin, "int-non-negative?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content >= 0)
  })

  pluginDefineFunction(plugin, "int-non-zero?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content !== 0)
  })

  pluginDefineFunction(plugin, "ineg", 1, (x) => {
    return Values.Int(-Values.asInt(x).content)
  })

  pluginDefineFunction(plugin, "iadd", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content + Values.asInt(y).content)
  })

  pluginDefineFunction(plugin, "isub", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content - Values.asInt(y).content)
  })

  pluginDefineFunction(plugin, "imul", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content * Values.asInt(y).content)
  })

  pluginDefineFunction(plugin, "idiv", 2, (x, y) => {
    return Values.Int(
      Math.trunc(Values.asInt(x).content / Values.asInt(y).content),
    )
  })

  pluginDefineFunction(plugin, "imod", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content % Values.asInt(y).content)
  })

  pluginDefineFunction(plugin, "int-max", 2, (x, y) => {
    return Values.Int(
      Math.max(Values.asInt(x).content, Values.asInt(y).content),
    )
  })

  pluginDefineFunction(plugin, "int-min", 2, (x, y) => {
    return Values.Int(
      Math.min(Values.asInt(x).content, Values.asInt(y).content),
    )
  })

  pluginDefineFunction(plugin, "int-greater?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content > Values.asInt(y).content)
  })

  pluginDefineFunction(plugin, "int-less?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content < Values.asInt(y).content)
  })

  pluginDefineFunction(plugin, "int-greater-equal?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content >= Values.asInt(y).content)
  })

  pluginDefineFunction(plugin, "int-less-equal?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content <= Values.asInt(y).content)
  })
}
