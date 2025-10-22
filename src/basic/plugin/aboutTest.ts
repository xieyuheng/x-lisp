import * as X from "@xieyuheng/x-sexp.js"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { pluginDefineInstrWithInstr, type Plugin } from "./index.ts"

export function aboutTest(plugin: Plugin) {
  pluginDefineInstrWithInstr(plugin, "assert", 1, (instr) => (value) => {
    if (!Values.isBool(value)) {
      let message = `(assert) value is not bool`
      message += `\n  value: ${formatValue(value)}`
      if (instr.meta) throw new X.ErrorWithMeta(message, instr.meta)
      else throw Error(message)
    }

    if (Values.isFalse(value)) {
      let message = `(assert) assertion fail`
      if (instr.meta) throw new X.ErrorWithMeta(message, instr.meta)
      else throw Error(message)
    }

    return Values.Void()
  })
}
