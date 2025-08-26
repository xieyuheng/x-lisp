import { formatValue } from "../format/index.ts"
import { type Value } from "../value/index.ts"
import { validate } from "./validate.ts"

export function the(schema: Value, value: Value): Value {
  const result = validate(schema, value)
  if (result.kind === "Ok") {
    return result.value
  }

  let message = `(the) assertion fail\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  value: ${formatValue(value)}\n`
  throw new Error(message)
}
