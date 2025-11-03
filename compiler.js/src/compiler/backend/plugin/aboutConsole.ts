import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { definePrimitiveFunction, type Plugin } from "./index.ts"

export function aboutConsole(plugin: Plugin) {
  definePrimitiveFunction(plugin, "print", 1, (value) => {
    console.log(formatValue(value))
    return Values.Void()
  })
}
