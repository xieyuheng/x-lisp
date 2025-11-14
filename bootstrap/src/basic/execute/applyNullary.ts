import { formatValue } from "../format/index.ts"
import { type Value } from "../value/index.ts"
import { call } from "./call.ts"
import { type Context } from "./Context.ts"

export function applyNullary(context: Context, target: Value): Value {
  switch (target.kind) {
    case "PrimitiveFunctionRef":
    case "FunctionRef": {
      return call(context, target, [])
    }

    default: {
      let message = `[applyNullary] can not apply target`
      message += `\n  target: ${formatValue(target)}`
      throw new Error(message)
    }
  }
}
