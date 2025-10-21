import { frameEval } from "../execute/index.ts"
import type { Plugins } from "./index.ts"

export const aboutCore: Plugins = {
  ret: {
    execute(context, frame, instr) {
      const [x] = instr.operands
      if (x !== undefined) {
        context.result = frameEval(frame, x)
      }

      context.frames.pop()
    },
  },
}
