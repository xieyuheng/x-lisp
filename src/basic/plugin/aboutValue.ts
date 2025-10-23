import assert from "node:assert"
import { equal } from "../equal/index.ts"
import { framePut } from "../execute/index.ts"
import * as Values from "../value/index.ts"
import {
  defineControlFlowInstr,
  definePureInstr,
  type Plugin,
} from "./index.ts"

export function aboutValue(plugin: Plugin) {
  defineControlFlowInstr(plugin, "const", (context, frame, instr) => {
    assert(instr.dest)
    assert(instr.operands[0].kind === "Imm")
    framePut(frame, instr.dest, instr.operands[0].value)
  })

  definePureInstr(plugin, "identity", 1, (value) => {
    return value
  })

  definePureInstr(plugin, "eq?", 2, (x, y) => {
    return Values.Bool(equal(x, y))
  })
}
