import { formatValue } from "../format/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"

export function validate(schema: Value, value: Value): boolean {
  const result = apply(schema, [value])

  if (result.kind === "Bool") {
    return result.content
  }

  let message = `[validate] expect result to be bool\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  value: ${formatValue(value)}\n`
  message += `  result: ${formatValue(result)}\n`
  throw new Error(message)
}
