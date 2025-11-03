import assert from "node:assert"
import { equal } from "../equal/index.ts"
import { framePut } from "../execute/index.ts"
import * as Values from "../value/index.ts"
import {
  defineControlFlowInstr,
  definePrimitiveFunction,
  type Plugin,
} from "./index.ts"
import { instrOperands } from "../instr/index.ts"

export function aboutValue(plugin: Plugin) {
  defineControlFlowInstr(plugin, "Const", (context, frame, instr) => {
    assert(instr.op === "Const")
    framePut(frame, instr.dest, instr.value)
  })

  definePrimitiveFunction(plugin, "identity", 1, (value) => {
    return value
  })

  definePrimitiveFunction(plugin, "equal?", 2, (x, y) => {
    return Values.Bool(equal(x, y))
  })
}
