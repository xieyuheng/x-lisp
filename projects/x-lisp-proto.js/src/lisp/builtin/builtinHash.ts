import { definePrimitiveFunction, provide } from "../define/index.ts"
import { isValid } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function builtinHash(mod: Mod) {
  provide(mod, [
    "hash?",
    "hash-empty?",
    "hash-length",
    "hash-get",
    "hash-has?",
    "hash-put",
    "hash-put!",
    "hash-delete!",
    "hash-copy",
    "hash-entries",
    "hash-keys",
    "hash-values",
  ])

  definePrimitiveFunction(mod, "hash?", 3, (keyP, valueP, target) => {
    if (!Values.isHashValue(target)) {
      return Values.BoolValue(false)
    }

    for (const entry of Values.hashEntries(target)) {
      if (!isValid(keyP, entry.key)) {
        return Values.BoolValue(false)
      }

      if (!isValid(valueP, entry.value)) {
        return Values.BoolValue(false)
      }
    }

    return Values.BoolValue(true)
  })

  definePrimitiveFunction(mod, "hash-empty?", 1, (hash) => {
    return Values.BoolValue(
      Values.hashEntries(Values.asHashValue(hash)).length === 0,
    )
  })

  definePrimitiveFunction(mod, "hash-length", 1, (hash) => {
    return Values.IntValue(
      BigInt(Values.hashEntries(Values.asHashValue(hash)).length),
    )
  })

  definePrimitiveFunction(mod, "hash-get", 2, (key, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-get) the given key is not hashable`
      message += `\n  key: ${formatValue(key)}`
      throw new Error(message)
    }

    const found = Values.hashGet(Values.asHashValue(hash), key)
    if (found) return found
    else return Values.NullValue()
  })

  definePrimitiveFunction(mod, "hash-has?", 2, (key, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-has?) the given key is not hashable`
      message += `\n  key: ${formatValue(key)}`
      throw new Error(message)
    }

    const found = Values.hashGet(Values.asHashValue(hash), key)
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
    for (const entry of Values.hashEntries(Values.asHashValue(hash))) {
      Values.hashPut(newHash, entry.key, entry.value)
    }

    Values.hashPut(newHash, key, value)
    return newHash
  })

  definePrimitiveFunction(mod, "hash-put!", 3, (key, value, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-put!) the given key is not hashable`
      message += `\n  key: ${formatValue(key)}`
      message += `\n  value: ${formatValue(value)}`
      throw new Error(message)
    }

    Values.hashPut(Values.asHashValue(hash), key, value)
    return hash
  })

  definePrimitiveFunction(mod, "hash-delete!", 2, (key, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-delete!) the given key is not hashable`
      message += `\n  key: ${formatValue(key)}`
      throw new Error(message)
    }

    Values.hashDelete(Values.asHashValue(hash), key)
    return hash
  })

  definePrimitiveFunction(mod, "hash-copy", 1, (hash) => {
    const newHash = Values.HashValue()
    for (const entry of Values.hashEntries(Values.asHashValue(hash))) {
      Values.hashPut(newHash, entry.key, entry.value)
    }

    return newHash
  })

  definePrimitiveFunction(mod, "hash-entries", 1, (hash) => {
    const elements: Array<Value> = []
    for (const entry of Values.hashEntries(Values.asHashValue(hash))) {
      elements.push(Values.ListValue([entry.key, entry.value]))
    }

    return Values.ListValue(elements)
  })

  definePrimitiveFunction(mod, "hash-keys", 1, (hash) => {
    const elements: Array<Value> = []
    for (const entry of Values.hashEntries(Values.asHashValue(hash))) {
      elements.push(entry.key)
    }

    return Values.ListValue(elements)
  })

  definePrimitiveFunction(mod, "hash-values", 1, (hash) => {
    const elements: Array<Value> = []
    for (const entry of Values.hashEntries(Values.asHashValue(hash))) {
      elements.push(entry.value)
    }

    return Values.ListValue(elements)
  })
}
