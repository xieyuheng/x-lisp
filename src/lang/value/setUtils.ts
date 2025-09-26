import { equal } from "../equal/index.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Set, type Value } from "./index.ts"

export function isSet(value: Value): value is Set {
  return value.kind === "Set"
}

export function asSet(value: Value): Set {
  if (value.kind === "Set") return value
  throw new Error(`[asSet] fail on: ${formatValue(value)}\n`)
}

export function setCopy(target: Value): Set {
  return Values.Set(setElements(target))
}

export function setElements(target: Value): Array<Value> {
  const set = asSet(target)
  return Array.from(set.entries.values()).map((entry) => entry.element)
}

export function setHas(target: Value, element: Value): boolean {
  const set = asSet(target)
  const hashKey = formatValue(element, { digest: true })
  return set.entries.has(hashKey)
}

export function setAdd(target: Value, element: Value): void {
  const set = asSet(target)
  const hashKey = formatValue(element, { digest: true })
  const entry = set.entries.get(hashKey)
  if (entry === undefined) {
    set.entries.set(hashKey, { hashKey, element })
  } else {
    entry.element = element
  }
}

export function setDelete(target: Value, element: Value): void {
  const set = asSet(target)
  const hashKey = formatValue(element, { digest: true })
  set.entries.delete(hashKey)
}

export function setDeleteAll(target: Value): void {
  const set = asSet(target)
  set.entries = new Map()
}

// old

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
