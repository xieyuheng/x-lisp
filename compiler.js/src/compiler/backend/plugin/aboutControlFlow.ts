import assert from "node:assert"
import {
  callFunction,
  frameGoto,
  frameLookup,
  framePut,
} from "../execute/index.ts"
import { instrOperands } from "../instr/index.ts"
import { defineControlFlowInstr, type Plugin } from "./index.ts"

export function aboutControlFlow(plugin: Plugin) {
  defineControlFlowInstr(plugin, "Return", (context, frame, instr) => {
    if (instrOperands(instr).length > 0) {
      context.result = frameLookup(frame, instrOperands(instr)[0])
    }

    context.frames.pop()
  })

  defineControlFlowInstr(plugin, "goto", (context, frame, instr) => {
    frameGoto(frame, instrOperands(instr)[0])
  })

  defineControlFlowInstr(plugin, "branch", (context, frame, instr) => {
    const condition = frameLookup(frame, instrOperands(instr)[0])
    assert(condition.kind === "Bool")

    const thenLabel = instrOperands(instr)[1]
    const elseLabel = instrOperands(instr)[2]

    if (condition.content) {
      frameGoto(frame, thenLabel)
    } else {
      frameGoto(frame, elseLabel)
    }
  })

  defineControlFlowInstr(plugin, "call", (context, frame, instr) => {
    assert(instr.op === "Call")
    const args = instrOperands(instr).map((x) => frameLookup(frame, x))
    callFunction(context, instr.target, args)
    if (instr.dest !== undefined) {
      assert(context.result)
      framePut(frame, instr.dest, context.result)
      delete context.result
    }
  })
}
