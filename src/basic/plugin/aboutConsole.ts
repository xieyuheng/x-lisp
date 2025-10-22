import { frameEval } from "../execute/index.ts"
import { formatValue } from "../format/index.ts"
import { pluginDefineHandler, type Plugin } from "./index.ts"

export function aboutConsole(plugin: Plugin) {
  pluginDefineHandler(plugin, "print", {
    execute(context, frame, instr) {
      const [x] = instr.operands
      const value = frameEval(frame, x)
      console.log(formatValue(value))
    },
  })
}
