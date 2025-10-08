import { equal } from "../equal/index.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"

type Result = { kind: "Ok"; value: Value } | { kind: "Err" }

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

export function validate(schema: Value, value: Value): Result {
  if (schema.kind === "Arrow") {
    return { kind: "Ok", value: Values.The(schema, value) }
  }

  if (schema.kind === "VariadicArrow") {
    return { kind: "Ok", value: Values.The(schema, value) }
  }

  if (schema.kind === "Polymorphic") {
    return { kind: "Ok", value: Values.The(schema, value) }
  }

  if (Values.isAtom(schema)) {
    if (equal(schema, value)) {
      return { kind: "Ok", value: value }
    } else {
      return { kind: "Err" }
    }
  }

  if (schema.kind === "Tau") {
    // Should not return new `Tael` on `Tau`,
    // because function schema might do
    // side effect on the old value.

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
      if (result.kind === "Ok" && !Values.isNull(attribute)) {
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

  let message = `(validation) predicate schema must return bool\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  value: ${formatValue(value)}\n`
  message += `  result: ${formatValue(result)}\n`
  throw new Error(message)
}
