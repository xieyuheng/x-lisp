import assert from "node:assert"
import type { Instr } from "../instr/index.ts"
import { modLookupDefinition } from "../mod/index.ts"
import { pluginExecuteInstr, useCorePlugin } from "../plugin/index.ts"
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

const corePlugin = useCorePlugin()

export function executeInstr(
  context: Context,
  frame: Frame,
  instr: Instr,
): void {
  pluginExecuteInstr(corePlugin, context, frame, instr)
}

export function callFunction(
  context: Context,
  name: string,
  args: Array<Value>,
): void {
  const definition = modLookupDefinition(context.mod, name)
  assert(definition)
  assert(definition.kind === "FunctionDefinition")
  const base = context.frames.length
  context.frames.push(createFrame(definition, args))
  while (context.frames.length > base) {
    executeOneStep(context)
  }
}
