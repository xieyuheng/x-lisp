import * as Values from "../value/index.ts"
import { pluginDefineFunction, type Plugin } from "./index.ts"

export function aboutBool(plugin: Plugin) {
  pluginDefineFunction(plugin, "not", 1, (x) => {
    return Values.Bool(!Values.asBool(x).content)
  })
}
