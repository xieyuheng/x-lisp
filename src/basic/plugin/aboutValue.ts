import assert from "node:assert"
import { equal } from "../equal/index.ts"
import { framePut } from "../execute/index.ts"
import * as Values from "../value/index.ts"
import {
  pluginDefineFunction,
  pluginDefineHandler,
  type Plugin,
} from "./index.ts"

export function aboutValue(plugin: Plugin) {
  pluginDefineHandler(plugin, "const", {
    execute(context, frame, instr) {
      assert(instr.dest)
      assert(instr.operands[0].kind === "Imm")
      framePut(frame, instr.dest, instr.operands[0].value)
    },
  })

  pluginDefineFunction(plugin, "identity", 1, (value) => {
    return value
  })

  pluginDefineFunction(plugin, "eq?", 2, (x, y) => {
    return Values.Bool(equal(x, y))
  })
}
