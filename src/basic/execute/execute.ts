import assert from "node:assert"
import type { Instr, Operand } from "../instr/index.ts"
import { modLookup } from "../mod/index.ts"
import type { Value } from "../value/index.ts"
import {
  contextCurrentFrame,
  contextIsFinished,
  type Context,
} from "./Context.ts"
import { createFrame, frameNextInstr, type Frame } from "./Frame.ts"

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
      const args = rest.map((x) => evaluateOperand(frame.env, x))
      callFunction(context, f.name, args)
      if (instr.dest !== undefined) {
        assert(context.result)
        frame.env.set(instr.dest, context.result)
        delete context.result
      }

      return
    }

    case "ret": {
      const [x] = instr.operands
      context.result = evaluateOperand(frame.env, x)
      context.frames.pop()
      return
    }
  }
}

export function callFunction(
  context: Context,
  name: string,
  args: Array<Value>,
): void {
  const definition = modLookup(context.mod, name)
  assert(definition)
  assert(definition.kind === "FunctionDefinition")
  const base = context.frames.length
  context.frames.push(createFrame(definition, args))
  while (context.frames.length > base) {
    executeOneStep(context)
  }
}

function evaluateOperand(env: Map<string, Value>, operand: Operand): Value {
  switch (operand.kind) {
    case "Var": {
      const value = env.get(operand.name)
      assert(value)
      return value
    }

    case "Imm": {
      return operand.value
    }
  }
}
