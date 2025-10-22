import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { pluginDefineFunction, type Plugin } from "./index.ts"

export function aboutTest(plugin: Plugin) {
  pluginDefineFunction(plugin, "assert", 1, (value) => {
    if (!Values.isBool(value)) {
      let message = `(assert) value is not bool`
      message += `\n  value: ${formatValue(value)}`
      throw new Error(message)
    }

    if (Values.isFalse(value)) {
      let message = `(assert) assertion fail`
      throw new Error(message)
    }

    return Values.Void()
  })
}
