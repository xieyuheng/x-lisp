import { frameEval } from "../execute/index.ts"
import { formatValue } from "../format/index.ts"
import type { Plugins } from "./index.ts"

export const aboutConsole: Plugins = {
  print: {
    execute(context, frame, instr) {
      const [x] = instr.operands
      const value = frameEval(frame, x)
      console.log(formatValue(value))
    },
  },
}
