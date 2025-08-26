import { flags } from "../../flags.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { applyWithSchema } from "./applyWithSchema.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function force(target: Value): Value {
  target = Values.lazyWalk(target)

  if (target.kind === "Thunk") {
    return resultValue(evaluate(target.body)(target.mod, target.env))
  }

  if (target.kind === "PrimitiveThunk") {
    return target.fn()
  }

  if (target.kind === "Claimed") {
    if (flags.debug) {
      return applyWithSchema(target.schema, force(target.value), [])
    } else {
      return force(target.value)
    }
  }

  let message = `[force] unhandled target value kind\n`
  message += `  target: ${formatValue(target)}\n`
  throw new Error(message)
}
