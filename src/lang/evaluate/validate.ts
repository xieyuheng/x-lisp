import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"

type Result = { kind: "Ok"; value: Value } | { kind: "Err" }

// `validate` should not return new value on `Tael`,
// because there might be side effect on the old value.

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

    for (const index of value.elements.keys()) {
      const elementSchema = schema.elementSchemas[index]
      const element = value.elements[index]
      const result = validate(elementSchema, element)
      if (result.kind === "Ok") {
        value.elements[index] = result.value
      } else {
        return { kind: "Err" }
      }
    }

    for (const key of Object.keys(schema.attributeSchemas)) {
      const attributeSchema = schema.attributeSchemas[key]
      const attribute = value.attributes[key] || Values.Null()
      const result = validate(attributeSchema, attribute)
      if (result.kind === "Ok" && attribute.kind !== "Null") {
        value.attributes[key] = result.value
      } else {
        return { kind: "Err" }
      }
    }

    return {
      kind: "Ok",
      value,
    }
  }

  const result = apply(schema, [value])
  if (Values.isBool(result)) {
    if (Values.isTrue(result)) {
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

export function validateOrFail(schema: Value, value: Value): Value {
  const result = validate(schema, value)
  if (result.kind === "Ok") {
    return result.value
  }

  let message = `[validateOrFail] assertion fail\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  value: ${formatValue(value)}\n`
  throw new Error(message)
}
