import assert from "node:assert"
import { callFunction, frameEval } from "../execute/index.ts"
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

  call: {
    execute(context, frame, instr) {
      const [f, ...rest] = instr.operands
      assert(f.kind === "Var")
      const args = rest.map((x) => frameEval(frame, x))
      callFunction(context, f.name, args)
      if (instr.dest !== undefined) {
        assert(context.result)
        frame.env.set(instr.dest, context.result)
        delete context.result
      }

      return
    },
  },

  print: {
    execute(context, frame, instr) {
      const [x] = instr.operands
      const value = frameEval(frame, x)
      console.log(value)
      return
    },
  },
}
