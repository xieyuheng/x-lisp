import assert from "node:assert"
import { equal } from "../equal/index.ts"
import {
  callFunction,
  frameEval,
  frameGoto,
  framePut,
} from "../execute/index.ts"
import * as Values from "../value/index.ts"
import type { Plugins } from "./index.ts"

export const aboutCore: Plugins = {
  return: {
    execute(context, frame, instr) {
      if (instr.operands.length > 0) {
        context.result = frameEval(frame, instr.operands[0])
      }

      context.frames.pop()
    },
  },

  goto: {
    execute(context, frame, instr) {
      assert(instr.operands[0].kind === "Var")
      frameGoto(frame, instr.operands[0].name)
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

  const: {
    execute(context, frame, instr) {
      assert(instr.dest)
      assert(instr.operands[0].kind === "Imm")
      framePut(frame, instr.dest, instr.operands[0].value)
    },
  },

  identity: {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      framePut(frame, instr.dest, x)
    },
  },

  "eq?": {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      framePut(frame, instr.dest, Values.Bool(equal(x, y)))
    },
  },
}
