import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type SetValue, type Value } from "./index.ts"

export function setCopy(target: Value): SetValue {
  return Values.SetValue(setElements(target))
}

export function setElements(target: Value): Array<Value> {
  const set = Values.asSetValue(target)
  return Array.from(set.entries.values()).map((entry) => entry.element)
}

export function setHas(target: Value, element: Value): boolean {
  if (!Values.isHashable(element)) {
    let message = `[setHas] element is not hashable`
    message += `\n  element: ${formatValue(element)}`
    message += `\n  target: ${formatValue(target)}`
    throw new Error(message)
  }

  const set = Values.asSetValue(target)
  const hashKey = formatValue(element, { digest: true })
  return set.entries.has(hashKey)
}

export function setAdd(target: Value, element: Value): void {
  if (!Values.isHashable(element)) {
    let message = `[setAdd] element is not hashable`
    message += `\n  element: ${formatValue(element)}`
    message += `\n  target: ${formatValue(target)}`
    throw new Error(message)
  }

  const set = Values.asSetValue(target)
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
    let message = `[setDelete] element is not hashable`
    message += `\n  element: ${formatValue(element)}`
    message += `\n  target: ${formatValue(target)}`
    throw new Error(message)
  }

  const set = Values.asSetValue(target)
  const hashKey = formatValue(element, { digest: true })
  set.entries.delete(hashKey)
}

export function setDeleteAll(target: Value): void {
  const set = Values.asSetValue(target)
  set.entries = new Map()
}
