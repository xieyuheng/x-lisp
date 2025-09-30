import { definePrimitiveFunction, provide } from "../define/index.ts"
import { apply } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function aboutHash(mod: Mod) {
  provide(mod, [
    "hash?",
    "hash-empty?",
    "hash-length",
    "hash-get",
    "hash-put",
    "hash-put!",
    "hash-delete!",
    "hash-copy",
    "hash-entries",
    "hash-keys",
    "hash-values",
  ])

  definePrimitiveFunction(mod, "hash?", 3, (keyP, valueP, target) => {
    if (!Values.isHash(target)) {
      return Values.Bool(false)
    }

    for (const entry of Values.hashEntries(target)) {
      const keyResult = apply(keyP, [entry.key])
      if (!Values.isBool(keyResult)) {
        let message = `(hash?) one result of applying the key predicate is not bool\n`
        message += `  result: ${formatValue(keyResult)}\n`
        message += `  key predicate: ${formatValue(keyP)}\n`
        message += `  key: ${formatValue(entry.key)}\n`
        message += `  value: ${formatValue(entry.value)}\n`
        message += `  target: ${formatValue(target)}\n`
        throw new Error(message)
      }

      if (Values.isFalse(keyResult)) {
        return Values.Bool(false)
      }

      const valueResult = apply(valueP, [entry.value])
      if (!Values.isBool(keyResult)) {
        let message = `(hash?) one result of applying the value predicate is not bool\n`
        message += `  result: ${formatValue(keyResult)}\n`
        message += `  value predicate: ${formatValue(valueP)}\n`
        message += `  key: ${formatValue(entry.key)}\n`
        message += `  value: ${formatValue(entry.value)}\n`
        message += `  target: ${formatValue(target)}\n`
        throw new Error(message)
      }

      if (Values.isFalse(valueResult)) {
        return Values.Bool(false)
      }
    }

    return Values.Bool(true)
  })

  definePrimitiveFunction(mod, "hash-empty?", 1, (hash) => {
    return Values.Bool(Values.hashEntries(Values.asHash(hash)).length === 0)
  })

  definePrimitiveFunction(mod, "hash-length", 1, (hash) => {
    return Values.Int(Values.hashEntries(Values.asHash(hash)).length)
  })

  definePrimitiveFunction(mod, "hash-get", 2, (key, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-get) the given key is not hashable\n`
      message += `  key: ${formatValue(key)}`
      throw new Error(message)
    }

    const found = Values.hashGet(Values.asHash(hash), key)
    if (found) return found
    else return Values.Null()
  })

  definePrimitiveFunction(mod, "hash-put", 3, (key, value, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-put) the given key is not hashable\n`
      message += `  key: ${formatValue(key)}`
      message += `  value: ${formatValue(value)}`
      throw new Error(message)
    }

    const newHash = Values.Hash()
    for (const entry of Values.hashEntries(Values.asHash(hash))) {
      Values.hashPut(newHash, entry.key, entry.value)
    }

    Values.hashPut(newHash, key, value)
    return newHash
  })

  definePrimitiveFunction(mod, "hash-put!", 3, (key, value, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-put!) the given key is not hashable\n`
      message += `  key: ${formatValue(key)}`
      message += `  value: ${formatValue(value)}`
      throw new Error(message)
    }

    Values.hashPut(Values.asHash(hash), key, value)
    return hash
  })

  definePrimitiveFunction(mod, "hash-delete!", 2, (key, hash) => {
    if (!Values.isHashable(key)) {
      let message = `(hash-delete!) the given key is not hashable\n`
      message += `  key: ${formatValue(key)}`
      throw new Error(message)
    }

    Values.hashDelete(Values.asHash(hash), key)
    return hash
  })

  definePrimitiveFunction(mod, "hash-copy", 1, (hash) => {
    const newHash = Values.Hash()
    for (const entry of Values.hashEntries(Values.asHash(hash))) {
      Values.hashPut(newHash, entry.key, entry.value)
    }

    return newHash
  })

  definePrimitiveFunction(mod, "hash-entries", 1, (hash) => {
    const elements: Array<Value> = []
    for (const entry of Values.hashEntries(Values.asHash(hash))) {
      elements.push(Values.List([entry.key, entry.value]))
    }

    return Values.List(elements)
  })

  definePrimitiveFunction(mod, "hash-keys", 1, (hash) => {
    const elements: Array<Value> = []
    for (const entry of Values.hashEntries(Values.asHash(hash))) {
      elements.push(entry.key)
    }

    return Values.List(elements)
  })

  definePrimitiveFunction(mod, "hash-values", 1, (hash) => {
    const elements: Array<Value> = []
    for (const entry of Values.hashEntries(Values.asHash(hash))) {
      elements.push(entry.value)
    }

    return Values.List(elements)
  })
}
