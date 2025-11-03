import assert from "node:assert"
import { frameGoto, frameLookup, framePut } from "../execute/index.ts"
import { instrOperands, type Instr } from "../instr/index.ts"
import { modLookupDefinition } from "../mod/index.ts"
import { type Value } from "../value/index.ts"
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
    case "Const": {
      framePut(frame, instr.dest, instr.value)
      return
    }

    case "Return": {
      if (instrOperands(instr).length > 0) {
        const [x] = instrOperands(instr)
        context.result = frameLookup(frame, x)
      }

      context.frames.pop()
      return
    }

    case "Goto": {
      frameGoto(frame, instr.label)
      return
    }

    case "Branch": {
      const [x] = instrOperands(instr)
      const condition = frameLookup(frame, x)
      assert(condition.kind === "Bool")
      if (condition.content) {
        frameGoto(frame, instr.thenLabel)
      } else {
        frameGoto(frame, instr.elseLabel)
      }

      return
    }

    case "Call": {
      const args = instrOperands(instr).map((x) => frameLookup(frame, x))
      call(context, instr.target, args)
      if (instr.dest !== undefined) {
        assert(context.result)
        framePut(frame, instr.dest, context.result)
        delete context.result
      }

      return
    }
  }
}

export function call(context: Context, name: string, args: Array<Value>): void {
  const definition = modLookupDefinition(context.mod, name)
  assert(definition)

  switch (definition.kind) {
    case "FunctionDefinition": {
      const base = context.frames.length
      context.frames.push(createFrame(definition, args))
      while (context.frames.length > base) {
        executeOneStep(context)
      }

      return
    }

    case "PrimitiveFunctionDefinition": {
      context.result = definition.fn(...args)
      return
    }
  }
}
