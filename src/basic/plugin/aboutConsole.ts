import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { pluginDefineInstr, type Plugin } from "./index.ts"

export function aboutConsole(plugin: Plugin) {
  pluginDefineInstr(plugin, "print", 1, (value) => {
    console.log(formatValue(value))
    return Values.Void()
  })
}
