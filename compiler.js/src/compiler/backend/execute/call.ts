import assert from "node:assert"
import { modLookupDefinition } from "../mod/index.ts"
import { type Value } from "../value/index.ts"
import { type Context } from "./Context.ts"
import { executeOneStep } from "./execute.ts"
import { createFrame } from "./Frame.ts"

export function call(context: Context, name: string, args: Array<Value>): null {
  const definition = modLookupDefinition(context.mod, name)
  assert(definition)

  switch (definition.kind) {
    case "FunctionDefinition": {
      const base = context.frames.length
      context.frames.push(createFrame(definition, args))
      while (context.frames.length > base) {
        executeOneStep(context)
      }

      return null
    }

    case "PrimitiveFunctionDefinition": {
      context.result = definition.fn(...args)
      return null
    }
  }
}
