import { formatValue } from "../format/index.ts"
import { type Value } from "./Value.ts"
import * as Values from "./index.ts"

export type SetValue = {
  kind: "SetValue"
  entries: Map<string, SetValueEntry>
}

export type SetValueEntry = {
  hashKey: string
  element: Value
}

export function SetValue(elements: Array<Value>): SetValue {
  const set: SetValue = {
    kind: "SetValue",
    entries: new Map(),
  }

  for (const element of elements) {
    setValueAdd(set, element)
  }

  return set
}

export function isSetValue(value: Value): value is SetValue {
  return value.kind === "SetValue"
}

export function asSetValue(value: Value): SetValue {
  if (isSetValue(value)) return value
  throw new Error(`[asSetValue] fail on: ${formatValue(value)}`)
}

export function setValueCopy(target: Value): SetValue {
  return SetValue(setValueElements(target))
}

export function setValueElements(target: Value): Array<Value> {
  const set = asSetValue(target)
  return Array.from(set.entries.values()).map((entry) => entry.element)
}

export function setValueHas(target: Value, element: Value): boolean {
  if (!Values.isHashable(element)) {
    let message = `[setHas] element is not hashable`
    message += `\n  element: ${formatValue(element)}`
    message += `\n  target: ${formatValue(target)}`
    throw new Error(message)
  }

  const set = asSetValue(target)
  const hashKey = formatValue(element, { digest: true })
  return set.entries.has(hashKey)
}

export function setValueAdd(target: Value, element: Value): void {
  if (!Values.isHashable(element)) {
    let message = `[setAdd] element is not hashable`
    message += `\n  element: ${formatValue(element)}`
    message += `\n  target: ${formatValue(target)}`
    throw new Error(message)
  }

  const set = asSetValue(target)
  const hashKey = formatValue(element, { digest: true })
  const entry = set.entries.get(hashKey)
  if (entry === undefined) {
    set.entries.set(hashKey, { hashKey, element })
  } else {
    entry.element = element
  }
}

export function setValueDelete(target: Value, element: Value): void {
  if (!Values.isHashable(element)) {
    let message = `[setDelete] element is not hashable`
    message += `\n  element: ${formatValue(element)}`
    message += `\n  target: ${formatValue(target)}`
    throw new Error(message)
  }

  const set = asSetValue(target)
  const hashKey = formatValue(element, { digest: true })
  set.entries.delete(hashKey)
}

export function setValueClear(target: Value): void {
  const set = asSetValue(target)
  set.entries = new Map()
}
