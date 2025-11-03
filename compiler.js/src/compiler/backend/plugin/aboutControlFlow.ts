import assert from "node:assert"
import {
  callFunction,
  frameEval,
  frameGoto,
  framePut,
} from "../execute/index.ts"
import { defineControlFlowInstr, type Plugin } from "./index.ts"

export function aboutControlFlow(plugin: Plugin) {
  defineControlFlowInstr(plugin, "return", (context, frame, instr) => {
    if (instr.operands.length > 0) {
      context.result = frameEval(frame, instr.operands[0])
    }

    context.frames.pop()
  })

  defineControlFlowInstr(plugin, "goto", (context, frame, instr) => {
    assert(instr.operands[0].kind === "Var")
    frameGoto(frame, instr.operands[0].name)
  })

  defineControlFlowInstr(plugin, "branch", (context, frame, instr) => {
    const condition = frameEval(frame, instr.operands[0])
    assert(condition.kind === "Bool")

    assert(instr.operands[1].kind === "Var")
    const thenLabel = instr.operands[1].name

    assert(instr.operands[2].kind === "Var")
    const elseLabel = instr.operands[2].name

    if (condition.content) {
      frameGoto(frame, thenLabel)
    } else {
      frameGoto(frame, elseLabel)
    }
  })

  defineControlFlowInstr(plugin, "apply", (context, frame, instr) => {
    const [f, ...rest] = instr.operands
    assert(f.kind === "Var")
    const args = rest.map((x) => frameEval(frame, x))
    callFunction(context, f.name, args)
    if (instr.dest !== undefined) {
      assert(context.result)
      framePut(frame, instr.dest, context.result)
      delete context.result
    }
  })
}
