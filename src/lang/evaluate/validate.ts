import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"

export type Result = { kind: "Ok"; value: Value } | { kind: "Err" }

export function validate(schema: Value, value: Value): Result {
  if (schema.kind === "Arrow") {
    return { kind: "Ok", value: Values.The(schema, value) }
  }

  const result = apply(schema, [value])
  if (result.kind === "Bool") {
    if (result.content === true) {
      return { kind: "Ok", value }
    } else {
      return { kind: "Err" }
    }
  }

  let message = `(validate) predicate schema must return bool\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  value: ${formatValue(value)}\n`
  message += `  result: ${formatValue(result)}\n`
  throw new Error(message)
}
