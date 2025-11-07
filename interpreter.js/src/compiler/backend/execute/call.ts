import assert from "node:assert"
import { type Definition } from "../definition/index.ts"
import { formatValues } from "../format/index.ts"
import { modLookupDefinition } from "../mod/index.ts"
import { type Value } from "../value/index.ts"
import { type Context } from "./Context.ts"
import { executeOneStep } from "./executeOneStep.ts"
import { createFrame } from "./Frame.ts"

export function call(
  context: Context,
  name: string,
  args: Array<Value>,
): Value {
  const definition = modLookupDefinition(context.mod, name)
  if (definition === undefined) {
    let message = `(call) undefined name`
    message += `\n  name: ${name}`
    message += `\n  args: ${formatValues(args)}`
    throw new Error(message)
  }

  return callDefinition(context, definition, args)
}

export function callDefinition(
  context: Context,
  definition: Definition,
  args: Array<Value>,
): Value {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const base = context.frames.length
      context.frames.push(createFrame(definition, args))
      while (context.frames.length > base) {
        executeOneStep(context)
      }

      const result = context.result
      assert(result)
      delete context.result
      return result
    }

    case "PrimitiveFunctionDefinition": {
      return definition.fn(...args)
    }
  }
}
