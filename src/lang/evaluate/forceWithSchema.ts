import { formatValue } from "../format/index.ts"
import { type Value } from "../value/index.ts"
import { applyPolymorphicWithAnythings } from "./applyPolymorphic.ts"
import { force } from "./force.ts"
import { validateOrFail } from "./validate.ts"

export function forceWithSchema(schema: Value, target: Value): Value {
  if (schema.kind === "Polymorphic") {
    return forceWithSchema(applyPolymorphicWithAnythings(schema), target)
  }

  if (schema.kind === "Arrow" && schema.argSchemas.length === 0) {
    return validateOrFail(schema.retSchema, force(target))
  }

  if (schema.kind === "VariadicArrow") {
    return validateOrFail(schema.retSchema, force(target))
  }

  let message = `[forceWithSchema] unhandled kind of schema`
  message += `\n  schema: ${formatValue(schema)}`
  message += `\n  target: ${formatValue(target)}`
  throw new Error(message)
}
