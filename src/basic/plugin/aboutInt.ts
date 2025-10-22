import * as Values from "../value/index.ts"
import { pluginDefineFunction, type Plugin } from "./index.ts"

export function aboutInt(plugin: Plugin) {
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
}
