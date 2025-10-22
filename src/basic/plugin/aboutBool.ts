import * as Values from "../value/index.ts"
import { pluginDefineInstr, type Plugin } from "./index.ts"

export function aboutBool(plugin: Plugin) {
  pluginDefineInstr(plugin, "not", 1, (x) => {
    return Values.Bool(!Values.asBool(x).content)
  })
}
