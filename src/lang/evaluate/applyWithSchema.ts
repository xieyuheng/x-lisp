import { formatValue } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"

export function applyWithSchema(
  schema: Value,
  target: Value,
  args: Array<Value>,
): Value {
  if (schema.kind === "Arrow") {
    const arrow = Values.arrowNormalize(schema)
    //
  }

  let message = `[applyWithSchema] unhandled kind of schema\n`
  message += `  schema: ${formatValue(schema)}\n`
  throw new Error(message)
}
