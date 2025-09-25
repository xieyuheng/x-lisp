import { definePrimitiveFunction, provide } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutHash(mod: Mod) {
  provide(mod, [
    "hash?",
    "hash-empty?",
    "hash-length",
    "hash-get",
    "hash-put",
    "hash-put!",
  ])

  definePrimitiveFunction(mod, "hash?", 1, (value) => {
    return Values.Bool(Values.isHash(value))
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
}
