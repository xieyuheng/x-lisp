import { arrayZip } from "../../utils/array/arrayZip.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"

export type Result = { kind: "Ok"; value: Value } | { kind: "Err" }

export function validate(schema: Value, value: Value): Result {
  schema = Values.lazyWalk(schema)
  value = Values.lazyWalk(value)

  if (schema.kind === "Arrow") {
    return { kind: "Ok", value: Values.The(schema, value) }
  }

  if (schema.kind === "Tau") {
    if (value.kind !== "Tael") {
      return { kind: "Err" }
    }

    if (schema.elementSchemas.length !== value.elements.length) {
      return { kind: "Err" }
    }

    const validatedElements: Array<Value> = []
    const zipped = arrayZip(schema.elementSchemas, value.elements)
    for (const [elementSchema, element] of zipped) {
      const result = validate(elementSchema, element)
      if (result.kind === "Ok") {
        validatedElements.push(result.value)
      } else {
        return { kind: "Err" }
      }
    }

    const validatedAttributes: Record<string, Value> = {}
    for (const key of Object.keys(schema.attributeSchemas)) {
      const attributeSchema = schema.attributeSchemas[key]
      const attribute = value.attributes[key] || Values.Null()
      const result = validate(attributeSchema, attribute)
      if (result.kind === "Ok") {
        validatedAttributes[key] = result.value
      } else {
        return { kind: "Err" }
      }
    }

    return {
      kind: "Ok",
      value: Values.Tael(validatedElements, validatedAttributes),
    }
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
