import { arrayZip } from "../../utils/array/arrayZip.ts"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { isValid } from "../evaluate/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutRecord(mod: Mod) {
  provide(mod, [
    "record?",
    "record-length",
    "record-keys",
    "record-values",
    "record-entries",
    "record-append",
    "record-copy",
    "record-empty?",
    "record-get",
    "record-has?",
    "record-put",
    "record-put!",
    "record-delete",
    "record-delete!",
  ])

  definePrimitiveFunction(mod, "record?", 2, (p, target) => {
    if (target.kind !== "Tael") {
      return Values.Bool(false)
    }

    for (const value of Object.values(Values.asTael(target).attributes)) {
      if (!isValid(p, value)) {
        return Values.Bool(false)
      }
    }

    return Values.Bool(true)
  })

  definePrimitiveFunction(mod, "record-length", 1, (record) => {
    const values = Object.values(Values.asTael(record).attributes).filter(
      (value) => !Values.isNull(value),
    )
    return Values.Int(values.length)
  })

  definePrimitiveFunction(mod, "record-keys", 1, (record) => {
    return Values.List(
      Object.keys(Values.asTael(record).attributes).map(Values.Symbol),
    )
  })

  definePrimitiveFunction(mod, "record-values", 1, (record) => {
    return Values.List(Object.values(Values.asTael(record).attributes))
  })

  definePrimitiveFunction(mod, "record-entries", 1, (record) => {
    return Values.List(
      arrayZip(
        Object.keys(Values.asTael(record).attributes).map(Values.Symbol),
        Object.values(Values.asTael(record).attributes),
      ).map(Values.List),
    )
  })

  definePrimitiveFunction(mod, "record-append", 2, (record, rest) => {
    return Values.Record({
      ...Values.asTael(record).attributes,
      ...Values.asTael(rest).attributes,
    })
  })

  definePrimitiveFunction(mod, "record-copy", 1, (record) => {
    return Values.Record({ ...Values.asTael(record).attributes })
  })

  definePrimitiveFunction(mod, "record-empty?", 1, (record) => {
    const values = Object.values(Values.asTael(record).attributes).filter(
      (value) => !Values.isNull(value),
    )
    return Values.Bool(values.length === 0)
  })

  definePrimitiveFunction(mod, "record-get", 2, (key, record) => {
    const attributes = Values.asTael(record).attributes
    const value = attributes[Values.asSymbol(key).content]
    if (value === undefined) {
      return Values.Null()
    } else {
      return value
    }
  })

  definePrimitiveFunction(mod, "record-has?", 2, (key, record) => {
    const attributes = Values.asTael(record).attributes
    const value = attributes[Values.asSymbol(key).content]
    if (value === undefined) {
      return Values.Bool(false)
    } else if (Values.isNull(value)) {
      return Values.Bool(false)
    } else {
      return Values.Bool(true)
    }
  })

  definePrimitiveFunction(mod, "record-put", 3, (key, value, record) => {
    const attributes = {
      ...Values.asTael(record).attributes,
      [Values.asSymbol(key).content]: value,
    }
    return Values.Tael(Values.asTael(record).elements, attributes)
  })

  definePrimitiveFunction(mod, "record-put!", 3, (key, value, record) => {
    Values.asTael(record).attributes[Values.asSymbol(key).content] = value
    return record
  })

  definePrimitiveFunction(mod, "record-delete", 2, (key, record) => {
    const attributes = {
      ...Values.asTael(record).attributes,
    }
    delete attributes[Values.asSymbol(key).content]
    return Values.Tael(Values.asTael(record).elements, attributes)
  })

  definePrimitiveFunction(mod, "record-delete!", 2, (key, record) => {
    delete Values.asTael(record).attributes[Values.asSymbol(key).content]
    return record
  })
}
