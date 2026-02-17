import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import { textWidth } from "../../config.ts"
import { equal } from "../equal/index.ts"
import { prettyValue } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"

type Result = { kind: "Ok"; value: Value } | { kind: "Err" }

export function isValid(schema: Value, value: Value): boolean {
  const result = validate(schema, value)
  return result.kind === "Ok"
}

export function validateOrFail(schema: Value, value: Value): Value {
  const width = textWidth
  const result = validate(schema, value)
  if (result.kind === "Ok") {
    return result.value
  }

  let message = `[validateOrFail] assertion fail`
  message += formatUnderTag(2, `schema:`, prettyValue(width, schema))
  message += formatUnderTag(2, `value:`, prettyValue(width, value))
  throw new Error(message)
}

export function validate(schema: Value, value: Value): Result {
  const width = textWidth

  if (schema.kind === "Arrow") {
    return { kind: "Ok", value: Values.TheValue(schema, value) }
  }

  if (schema.kind === "VariadicArrow") {
    return { kind: "Ok", value: Values.TheValue(schema, value) }
  }

  if (schema.kind === "Polymorphic") {
    return { kind: "Ok", value: Values.TheValue(schema, value) }
  }

  if (Values.isAtomValue(schema)) {
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
      const attribute = value.attributes[key] || Values.NullValue()
      const result = validate(attributeSchema, attribute)
      if (result.kind === "Ok" && !Values.isNullValue(attribute)) {
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
  if (Values.isBoolValue(result)) {
    if (Values.isTrueValue(result)) {
      return { kind: "Ok", value }
    } else {
      return { kind: "Err" }
    }
  }

  let message = `[validate] predicate schema must return bool`
  message += formatUnderTag(2, `schema:`, prettyValue(width, schema))
  message += formatUnderTag(2, `value:`, prettyValue(width, value))
  message += formatUnderTag(2, `result:`, prettyValue(width, result))
  throw new Error(message)
}
