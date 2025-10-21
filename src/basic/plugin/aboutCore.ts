import { frameEval } from "../execute/index.ts"
import type { Plugins } from "./index.ts"

export function aboutCore(): Plugins {
  return {
    ret: {
      execute(context, frame, instr) {
        const [x] = instr.operands
        if (x !== undefined) {
          context.result = frameEval(frame.env, x)
        }

        context.frames.pop()
      },
    },
  }
}
