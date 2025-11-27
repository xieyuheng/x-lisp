import assert from "node:assert"
import { type Definition } from "../definition/index.ts"
import { type Value } from "../value/index.ts"
import { type Context } from "./Context.ts"
import { executeOneStep } from "./executeOneStep.ts"
import { createFrame } from "./Frame.ts"

export function call(
  context: Context,
  definition: Definition,
  args: Array<Value>,
): Value {
  switch (definition.kind) {
    case "FunctionDefinition":
    case "SetupDefinition": {
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
