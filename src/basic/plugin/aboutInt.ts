import * as Values from "../value/index.ts"
import { definePureInstr, type Plugin } from "./index.ts"

export function aboutInt(plugin: Plugin) {
  definePureInstr(plugin, "int-positive?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content > 0)
  })

  definePureInstr(plugin, "int-non-negative?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content >= 0)
  })

  definePureInstr(plugin, "int-non-zero?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content !== 0)
  })

  definePureInstr(plugin, "ineg", 1, (x) => {
    return Values.Int(-Values.asInt(x).content)
  })

  definePureInstr(plugin, "iadd", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content + Values.asInt(y).content)
  })

  definePureInstr(plugin, "isub", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content - Values.asInt(y).content)
  })

  definePureInstr(plugin, "imul", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content * Values.asInt(y).content)
  })

  definePureInstr(plugin, "idiv", 2, (x, y) => {
    return Values.Int(
      Math.trunc(Values.asInt(x).content / Values.asInt(y).content),
    )
  })

  definePureInstr(plugin, "imod", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content % Values.asInt(y).content)
  })

  definePureInstr(plugin, "int-max", 2, (x, y) => {
    return Values.Int(
      Math.max(Values.asInt(x).content, Values.asInt(y).content),
    )
  })

  definePureInstr(plugin, "int-min", 2, (x, y) => {
    return Values.Int(
      Math.min(Values.asInt(x).content, Values.asInt(y).content),
    )
  })

  definePureInstr(plugin, "int-greater?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content > Values.asInt(y).content)
  })

  definePureInstr(plugin, "int-less?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content < Values.asInt(y).content)
  })

  definePureInstr(plugin, "int-greater-equal?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content >= Values.asInt(y).content)
  })

  definePureInstr(plugin, "int-less-equal?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content <= Values.asInt(y).content)
  })
}
