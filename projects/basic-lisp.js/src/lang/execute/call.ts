import assert from "node:assert"
import { type Definition } from "../definition/index.ts"
import { formatValue, formatValues } from "../format/index.ts"
import { modLookupDefinition } from "../mod/index.ts"
import { type Value } from "../value/index.ts"
import { type Context } from "./Context.ts"
import { executeOneStep } from "./executeOneStep.ts"
import { createFrame } from "./Frame.ts"

export function call(
  context: Context,
  target: Value,
  args: Array<Value>,
): Value {
  switch (target.kind) {
    case "Function": {
      const definition = modLookupDefinition(context.mod, target.name)
      if (definition === undefined) {
        let message = `(call) undefined name`
        message += `\n  name: ${target}`
        message += `\n  args: ${formatValues(args)}`
        throw new Error(message)
      }

      return callDefinition(context, definition, args)
    }

    default: {
      let message = `[call] unhandled target`
      message += `\n  target: ${formatValue(target)}`
      throw new Error(message)
    }
  }
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

      const result = context.returnValue
      assert(result)
      delete context.returnValue
      return result
    }

    case "PrimitiveFunctionDefinition": {
      return definition.fn(context)(...args)
    }

    default: {
      let message = `[callDefinition] unhandle kind`
      message += `\n  definition kind: ${definition.kind}`
      throw new Error(message)
    }
  }
}
