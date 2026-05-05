import { definePrimitiveFunction } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function builtinHash(mod: Mod) {
  definePrimitiveFunction(mod, "make-hash", 0, () => {
    return Values.HashValue()
  })

  definePrimitiveFunction(mod, "hash-empty?", 1, (hash) => {
    return Values.BoolValue(
      Values.hashValueEntries(Values.asHashValue(hash)).length === 0,
    )
  })

  definePrimitiveFunction(mod, "hash-length", 1, (hash) => {
    return Values.IntValue(
      BigInt(Values.hashValueEntries(Values.asHashValue(hash)).length),
    )
  })

  definePrimitiveFunction(mod, "hash-get", 2, (key, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-get) the given key is not hashable`
      message += `\n  key: ${formatValue(key)}`
      message += `\n  hash: ${formatValue(hash)}`
      throw new Error(message)
    }

    const found = Values.hashValueGet(Values.asHashValue(hash), key)
    if (found === undefined) {
      let message = `(hash-get) no such key`
      message += `\n  key: ${formatValue(key)}`
      message += `\n  hash: ${formatValue(hash)}`
      throw new Error(message)
    } else {
      return found
    }
  })

  definePrimitiveFunction(mod, "hash-has?", 2, (key, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-has?) the given key is not hashable`
      message += `\n  key: ${formatValue(key)}`
      throw new Error(message)
    }

    const found = Values.hashValueGet(Values.asHashValue(hash), key)
    return Values.BoolValue(found !== undefined)
  })

  definePrimitiveFunction(mod, "hash-put", 3, (key, value, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-put) the given key is not hashable`
      message += `\n  key: ${formatValue(key)}`
      message += `\n  value: ${formatValue(value)}`
      throw new Error(message)
    }

    const newHash = Values.HashValue()
    for (const entry of Values.hashValueEntries(Values.asHashValue(hash))) {
      Values.hashValuePut(newHash, entry.key, entry.value)
    }

    Values.hashValuePut(newHash, key, value)
    return newHash
  })

  definePrimitiveFunction(mod, "hash-put!", 3, (key, value, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-put!) the given key is not hashable`
      message += `\n  key: ${formatValue(key)}`
      message += `\n  value: ${formatValue(value)}`
      throw new Error(message)
    }

    Values.hashValuePut(Values.asHashValue(hash), key, value)
    return hash
  })

  definePrimitiveFunction(mod, "hash-delete!", 2, (key, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-delete!) the given key is not hashable`
      message += `\n  key: ${formatValue(key)}`
      throw new Error(message)
    }

    Values.hashValueDelete(Values.asHashValue(hash), key)
    return hash
  })

  definePrimitiveFunction(mod, "hash-copy", 1, (hash) => {
    const newHash = Values.HashValue()
    for (const entry of Values.hashValueEntries(Values.asHashValue(hash))) {
      Values.hashValuePut(newHash, entry.key, entry.value)
    }

    return newHash
  })

  definePrimitiveFunction(mod, "hash-entries", 1, (hash) => {
    const elements: Array<Value> = []
    for (const entry of Values.hashValueEntries(Values.asHashValue(hash))) {
      elements.push(Values.RecordValue({ key: entry.key, value: entry.value }))
    }

    return Values.ListValue(elements)
  })

  definePrimitiveFunction(mod, "hash-keys", 1, (hash) => {
    const elements: Array<Value> = []
    for (const entry of Values.hashValueEntries(Values.asHashValue(hash))) {
      elements.push(entry.key)
    }

    return Values.ListValue(elements)
  })

  definePrimitiveFunction(mod, "hash-values", 1, (hash) => {
    const elements: Array<Value> = []
    for (const entry of Values.hashValueEntries(Values.asHashValue(hash))) {
      elements.push(entry.value)
    }

    return Values.ListValue(elements)
  })
}
