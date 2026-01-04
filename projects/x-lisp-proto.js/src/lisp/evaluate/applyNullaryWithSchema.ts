import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import { globals } from "../../globals.ts"
import { prettyValue } from "../pretty/index.ts"
import { type Value } from "../value/index.ts"
import { applyNullary } from "./applyNullary.ts"
import { applyPolymorphicWithAnythings } from "./applyPolymorphic.ts"
import { validateOrFail } from "./validate.ts"

export function applyNullaryWithSchema(schema: Value, target: Value): Value {
  const width = globals.width

  if (schema.kind === "Polymorphic") {
    return applyNullaryWithSchema(applyPolymorphicWithAnythings(schema), target)
  }

  if (schema.kind === "Arrow" && schema.argSchemas.length === 0) {
    return validateOrFail(schema.retSchema, applyNullary(target))
  }

  if (schema.kind === "VariadicArrow") {
    return validateOrFail(schema.retSchema, applyNullary(target))
  }

  let message = `[applyNullaryWithSchema] unhandled kind of schema`
  message += formatUnderTag(2, `schema:`, prettyValue(width, schema))
  message += formatUnderTag(2, `target:`, prettyValue(width, target))
  throw new Error(message)
}
