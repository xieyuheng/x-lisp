import { type Value } from "../value/index.ts"

export function the(schema: Value, value: Value): Value {
  const result = apply(schema, value)
  if (result.kind === "Claimed") {
    return result
  }

  if (result.kind === "Bool") {
    if (result.content === false) {
      let message = `(the) assertion fail`
      message += `  schema: ${formatValue(schema)}\n`
      message += `  value: ${formatValue(value)}\n`
      throw new Error(message)
    }

    return value
  }

  let message = `(the) unhandled result kind\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  value: ${formatValue(value)}\n`
  message += `  result: ${formatValue(result)}\n`
  throw new Error(message)
}
