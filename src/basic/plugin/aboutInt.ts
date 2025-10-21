import assert from "node:assert"
import { frameEval, framePut } from "../execute/index.ts"
import * as Values from "../value/index.ts"
import type { Plugins } from "./index.ts"

export const aboutInt: Plugins = {
  iadd: {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      const result = Values.Int(
        Values.asInt(x).content + Values.asInt(y).content,
      )
      framePut(frame, instr.dest, result)
    },
  },

  isub: {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      const result = Values.Int(
        Values.asInt(x).content - Values.asInt(y).content,
      )
      framePut(frame, instr.dest, result)
    },
  },

  imul: {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      const result = Values.Int(
        Values.asInt(x).content * Values.asInt(y).content,
      )
      framePut(frame, instr.dest, result)
    },
  },

  idiv: {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      const result = Values.Int(
        Math.trunc(Values.asInt(x).content / Values.asInt(y).content),
      )
      framePut(frame, instr.dest, result)
    },
  },

  imod: {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      const result = Values.Int(
        Values.asInt(x).content % Values.asInt(y).content,
      )
      framePut(frame, instr.dest, result)
    },
  },
}
