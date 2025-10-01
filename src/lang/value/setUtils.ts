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
  if (!Values.isHashable(element)) {
    let message = `[setHas] element is not hashable\n`
    message += `  element: ${formatValue(element)}\n`
    message += `  target: ${formatValue(target)}\n`
    throw new Error(message)
  }

  const set = asSet(target)
  const hashKey = formatValue(element, { digest: true })
  return set.entries.has(hashKey)
}

export function setAdd(target: Value, element: Value): void {
  if (!Values.isHashable(element)) {
    let message = `[setAdd] element is not hashable\n`
    message += `  element: ${formatValue(element)}\n`
    message += `  target: ${formatValue(target)}\n`
    throw new Error(message)
  }

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
  if (!Values.isHashable(element)) {
    let message = `[setDelete] element is not hashable\n`
    message += `  element: ${formatValue(element)}\n`
    message += `  target: ${formatValue(target)}\n`
    throw new Error(message)
  }

  const set = asSet(target)
  const hashKey = formatValue(element, { digest: true })
  set.entries.delete(hashKey)
}

export function setDeleteAll(target: Value): void {
  const set = asSet(target)
  set.entries = new Map()
}
