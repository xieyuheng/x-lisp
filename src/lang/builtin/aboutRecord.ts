import { arrayZip } from "../../utils/array/arrayZip.ts"
import { recordMap } from "../../utils/record/recordMap.ts"
import { definePrimitiveFunction } from "../define/index.ts"
import { apply } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutRecord(mod: Mod) {
  definePrimitiveFunction(mod, "record?", 2, (p, target) => {
    if (target.kind !== "Tael") {
      return Values.Bool(false)
    }

    for (const value of Object.values(Values.asTael(target).attributes)) {
      const result = apply(p, [value])
      if (result.kind !== "Bool") {
        let message = `(record?) one result of applying the predicate is not bool\n`
        message += `  predicate: ${formatValue(p)}\n`
        message += `  target: ${formatValue(target)}\n`
        message += `  value: ${formatValue(value)}\n`
        message += `  result: ${formatValue(result)}\n`
        throw new Error(message)
      }

      if (result.content === false) {
        return Values.Bool(false)
      }
    }

    return Values.Bool(true)
  })

  definePrimitiveFunction(mod, "record-length", 1, (record) => {
    const values = Object.values(Values.asTael(record).attributes).filter(
      (value) => value.kind !== "Null",
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

  definePrimitiveFunction(mod, "record-of", 1, (record) => {
    return Values.Record({ ...Values.asTael(record).attributes })
  })

  definePrimitiveFunction(mod, "record-empty?", 1, (record) => {
    const values = Object.values(Values.asTael(record).attributes).filter(
      (value) => value.kind !== "Null",
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
    } else if (value.kind === "Null") {
      return Values.Bool(false)
    } else {
      return Values.Bool(true)
    }
  })

  definePrimitiveFunction(mod, "record-set", 3, (key, value, record) => {
    const attributes = {
      ...Values.asTael(record).attributes,
      [Values.asSymbol(key).content]: value,
    }
    return Values.Tael(Values.asTael(record).elements, attributes)
  })

  definePrimitiveFunction(mod, "record-delete", 2, (key, record) => {
    const attributes = {
      ...Values.asTael(record).attributes,
    }
    delete attributes[Values.asSymbol(key).content]
    return Values.Tael(Values.asTael(record).elements, attributes)
  })

  definePrimitiveFunction(mod, "record-map", 2, (fn, record) => {
    return Values.Tael(
      Values.asTael(record).elements,
      recordMap(Values.asTael(record).attributes, (value) =>
        apply(fn, [value]),
      ),
    )
  })
}
