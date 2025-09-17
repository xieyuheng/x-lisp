import { equal } from "../equal/index.ts"
import { formatValue } from "../format/index.ts"
import { type Set, type Value } from "./Value.ts"

export function asSet(value: Value): Set {
  if (value.kind === "Set") return value
  throw new Error(`[asSet] fail on: ${formatValue(value)}\n`)
}

export function valueArrayDedup(values: Array<Value>): Array<Value> {
  const dedupedValues: Array<Value> = []
  for (const value of values) {
    if (!dedupedValues.some((occurred) => equal(value, occurred))) {
      dedupedValues.push(value)
    }
  }

  return dedupedValues
}

export function valueArrayMember(target: Value, values: Array<Value>): boolean {
  for (const value of values) {
    if (equal(value, target)) {
      return true
    }
  }

  return false
}
