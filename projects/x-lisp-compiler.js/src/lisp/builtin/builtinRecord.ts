import { arrayZip } from "@xieyuheng/helpers.js/array"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinRecord(mod: Mod) {
  provide(mod, [
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

  definePrimitiveFunction(mod, "record-length", 1, (record) => {
    const values = Object.values(Values.asTaelValue(record).attributes).filter(
      (value) => !Values.isNullValue(value),
    )
    return Values.IntValue(BigInt(values.length))
  })

  definePrimitiveFunction(mod, "record-keys", 1, (record) => {
    return Values.ListValue(
      Object.keys(Values.asTaelValue(record).attributes).map(
        Values.SymbolValue,
      ),
    )
  })

  definePrimitiveFunction(mod, "record-values", 1, (record) => {
    return Values.ListValue(
      Object.values(Values.asTaelValue(record).attributes),
    )
  })

  definePrimitiveFunction(mod, "record-entries", 1, (record) => {
    return Values.ListValue(
      arrayZip(
        Object.keys(Values.asTaelValue(record).attributes).map(
          Values.SymbolValue,
        ),
        Object.values(Values.asTaelValue(record).attributes),
      ).map(Values.ListValue),
    )
  })

  definePrimitiveFunction(mod, "record-append", 2, (record, rest) => {
    return Values.RecordValue({
      ...Values.asTaelValue(record).attributes,
      ...Values.asTaelValue(rest).attributes,
    })
  })

  definePrimitiveFunction(mod, "record-copy", 1, (record) => {
    return Values.RecordValue({ ...Values.asTaelValue(record).attributes })
  })

  definePrimitiveFunction(mod, "record-empty?", 1, (record) => {
    const values = Object.values(Values.asTaelValue(record).attributes).filter(
      (value) => !Values.isNullValue(value),
    )
    return Values.BoolValue(values.length === 0)
  })

  definePrimitiveFunction(mod, "record-get", 2, (key, record) => {
    const attributes = Values.asTaelValue(record).attributes
    const value = attributes[Values.asSymbolValue(key).content]
    if (value === undefined) {
      return Values.NullValue()
    } else {
      return value
    }
  })

  definePrimitiveFunction(mod, "record-has?", 2, (key, record) => {
    const attributes = Values.asTaelValue(record).attributes
    const value = attributes[Values.asSymbolValue(key).content]
    if (value === undefined) {
      return Values.BoolValue(false)
    } else if (Values.isNullValue(value)) {
      return Values.BoolValue(false)
    } else {
      return Values.BoolValue(true)
    }
  })

  definePrimitiveFunction(mod, "record-put", 3, (key, value, record) => {
    const attributes = {
      ...Values.asTaelValue(record).attributes,
      [Values.asSymbolValue(key).content]: value,
    }
    return Values.TaelValue(Values.asTaelValue(record).elements, attributes)
  })

  definePrimitiveFunction(mod, "record-put!", 3, (key, value, record) => {
    Values.asTaelValue(record).attributes[Values.asSymbolValue(key).content] =
      value
    return record
  })

  definePrimitiveFunction(mod, "record-delete", 2, (key, record) => {
    const attributes = {
      ...Values.asTaelValue(record).attributes,
    }
    delete attributes[Values.asSymbolValue(key).content]
    return Values.TaelValue(Values.asTaelValue(record).elements, attributes)
  })

  definePrimitiveFunction(mod, "record-delete!", 2, (key, record) => {
    delete Values.asTaelValue(record).attributes[
      Values.asSymbolValue(key).content
    ]
    return record
  })
}
