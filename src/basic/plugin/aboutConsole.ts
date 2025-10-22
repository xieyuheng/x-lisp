import { frameEval } from "../execute/index.ts"
import { formatValue } from "../format/index.ts"
import { pluginHandler, type Plugin } from "./index.ts"

export function aboutConsole(plugin: Plugin) {
  pluginHandler(plugin, "print", {
    execute(context, frame, instr) {
      const [x] = instr.operands
      const value = frameEval(frame, x)
      console.log(formatValue(value))
    },
  })
}
