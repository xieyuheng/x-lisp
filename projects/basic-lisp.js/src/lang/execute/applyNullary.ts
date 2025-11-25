import assert from "node:assert"
import { formatValue } from "../format/index.ts"
import { modLookupDefinition } from "../mod/index.ts"
import { type Value } from "../value/index.ts"
import { callDefinition } from "./call.ts"
import { type Context } from "./Context.ts"

export function applyNullary(context: Context, target: Value): Value {
  switch (target.kind) {
    case "Function": {
      const fn = target
      const definition = modLookupDefinition(context.mod, fn.name)
      assert(definition)
      return callDefinition(context, definition, [])
    }

    default: {
      let message = `[applyNullary] can not apply target`
      message += `\n  target: ${formatValue(target)}`
      throw new Error(message)
    }
  }
}
