import assert from "node:assert"
import { frameEval, framePut } from "../execute/index.ts"
import * as Values from "../value/index.ts"
import { pluginDefineHandler, type Plugin } from "./index.ts"

export function aboutInt(plugin: Plugin) {
  pluginDefineHandler(plugin, "iadd", {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      const result = Values.Int(
        Values.asInt(x).content + Values.asInt(y).content,
      )
      framePut(frame, instr.dest, result)
    },
  })

  pluginDefineHandler(plugin, "isub", {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      const result = Values.Int(
        Values.asInt(x).content - Values.asInt(y).content,
      )
      framePut(frame, instr.dest, result)
    },
  })

  pluginDefineHandler(plugin, "imul", {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      const result = Values.Int(
        Values.asInt(x).content * Values.asInt(y).content,
      )
      framePut(frame, instr.dest, result)
    },
  })

  pluginDefineHandler(plugin, "idiv", {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      const result = Values.Int(
        Math.trunc(Values.asInt(x).content / Values.asInt(y).content),
      )
      framePut(frame, instr.dest, result)
    },
  })

  pluginDefineHandler(plugin, "imod", {
    execute(context, frame, instr) {
      assert(instr.dest)
      const x = frameEval(frame, instr.operands[0])
      const y = frameEval(frame, instr.operands[1])
      const result = Values.Int(
        Values.asInt(x).content % Values.asInt(y).content,
      )
      framePut(frame, instr.dest, result)
    },
  })
}
