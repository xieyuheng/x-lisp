import { flags } from "../../flags.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"
import { validate } from "./validate.ts"

export function force(target: Value): Value {
  target = Values.lazyWalk(target)

  if (target.kind === "Thunk") {
    return resultValue(evaluate(target.body)(target.mod, target.env))
  }

  if (target.kind === "PrimitiveThunk") {
    return target.fn()
  }

  if (target.kind === "The") {
    if (flags.debug) {
      return forceWithSchema(target.schema, target.value)
    } else {
      return force(target.value)
    }
  }

  let message = `[force] unhandled target value kind\n`
  message += `  target: ${formatValue(target)}\n`
  throw new Error(message)
}

function forceWithSchema(schema: Value, target: Value): Value {
  schema = Values.lazyWalk(schema)
  target = Values.lazyWalk(target)

  if (schema.kind === "Arrow" && schema.argSchemas.length === 0) {
    return validate(schema.retSchema, force(target))
  }

  let message = `[forceWithSchema] unhandled kind of schema\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  target: ${formatValue(target)}\n`
  throw new Error(message)
}
