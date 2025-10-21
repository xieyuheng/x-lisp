import assert from "node:assert"
import type { Instr } from "../instr/index.ts"
import { contextIsFinished, type Context } from "./Context.ts"
import type { Frame } from "./Frame.ts"

export function executeOneStep(context: Context): void {
  if (contextIsFinished(context)) return

  const frame = contextCurrentFrame(context)
  const instr = frameNextInstr(frame)
  executeInstr(context, frame, instr)
}

export function executeInstr(
  context: Context,
  frame: Frame,
  instr: Instr,
): void {
  switch (instr.op) {
    case "call": {
      const [f, ...rest] = instr.operands
      assert(f.kind === "Var")
      const definition = modLookup(context.mod, f.name)
      assert(definition.kind === "FunctionDefinition")
      const args = rest.map(evaluateOperand(frame.env))
      context.frames.push(createFrame(definition, args))
    }

    case "ret": {
      const [x] = instr.operands
      context.result = evaluateOperand(frame.env)(x)
      context.frames.pop()
    }
  }
}

// evaluateOperand
// framePut
// frameGet
