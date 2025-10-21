import assert from "node:assert"
import { callFunction, frameEval, framePut } from "../execute/index.ts"
import type { Plugins } from "./index.ts"

export const aboutCore: Plugins = {
  return: {
    execute(context, frame, instr) {
      const [x] = instr.operands
      if (x !== undefined) context.result = frameEval(frame, x)
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
        framePut(frame, instr.dest, context.result)
        delete context.result
      }
    },
  },

  identity: {
    execute(context, frame, instr) {
      assert(instr.dest)
      const [x] = instr.operands
      framePut(frame, instr.dest, frameEval(frame, x))
    },
  },

  const: {
    execute(context, frame, instr) {
      assert(instr.dest)
      const [x] = instr.operands
      assert(x.kind === "Imm")
      framePut(frame, instr.dest, x.value)
    },
  },
}
