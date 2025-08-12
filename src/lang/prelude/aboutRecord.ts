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

  definePrimitiveFunction(mod, "record-length", 1, (x) =>
    Values.Int(Object.keys(Values.asTael(x).attributes).length),
  )

  definePrimitiveFunction(mod, "record-update", 2, (x, y) =>
    Values.Tael(Values.asTael(x).elements, {
      ...Values.asTael(x).attributes,
      ...Values.asTael(y).attributes,
    }),
  )

  definePrimitiveFunction(mod, "record-of", 1, (x) =>
    Values.Record({ ...Values.asTael(x).attributes }),
  )
}
