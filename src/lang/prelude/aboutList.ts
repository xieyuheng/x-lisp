import { definePrimitiveFunction } from "../define/index.ts"
import { apply } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutList(mod: Mod) {
  definePrimitiveFunction(mod, "list-empty?", 1, (x) => {
    return Values.Bool(Values.asTael(x).elements.length === 0)
  })

  definePrimitiveFunction(mod, "list?", 2, (p, target) => {
    if (target.kind !== "Tael") {
      return Values.Bool(false)
    }

    for (const element of Values.asTael(target).elements) {
      const result = apply(p, [element])
      if (result.kind !== "Bool") {
        let message = `(list?) one result of applying the predicate is not bool\n`
        message += `  predicate: ${formatValue(p)}\n`
        message += `  target: ${formatValue(target)}\n`
        message += `  element: ${formatValue(element)}\n`
        message += `  result: ${formatValue(result)}\n`
        throw new Error(message)
      }

      if (result.content === false) {
        return Values.Bool(false)
      }
    }

    return Values.Bool(true)
  })

  definePrimitiveFunction(mod, "car", 1, (x) => {
    if (Values.asTael(x).elements.length === 0) {
      throw new Error("[car] expect target to be non empty list")
    }

    return Values.asTael(x).elements[0]
  })

  definePrimitiveFunction(mod, "cdr", 1, (x) => {
    if (Values.asTael(x).elements.length === 0) {
      throw new Error("[cdr] expect target to be non empty list")
    }

    return Values.Tael(
      Values.asTael(x).elements.slice(1),
      Values.asTael(x).attributes,
    )
  })

  definePrimitiveFunction(mod, "cons", 2, (head, tail) => {
    return Values.Tael(
      [head, ...Values.asTael(tail).elements],
      Values.asTael(tail).attributes,
    )
  })

  definePrimitiveFunction(mod, "list-length", 1, (x) =>
    Values.Int(Values.asTael(x).elements.length),
  )

  definePrimitiveFunction(mod, "list-append", 2, (x, y) =>
    Values.Tael(
      [...Values.asTael(x).elements, ...Values.asTael(y).elements],
      Values.asTael(x).attributes,
    ),
  )

  definePrimitiveFunction(mod, "list-of", 1, (x) =>
    Values.List([...Values.asTael(x).elements]),
  )

  definePrimitiveFunction(mod, "list-get", 2, (list, index) => {
    const elements = Values.asTael(list).elements
    const i = Values.asInt(index).content
    if (i < elements.length) {
      return elements[i]
    } else {
      let message = `(list-get) index out of bound\n`
      message += `  list: ${formatValue(list)}\n`
      message += `  index: ${formatValue(index)}\n`
      throw new Error(message)
    }
  })

  definePrimitiveFunction(mod, "list-set", 3, (list, index, value) => {
    const elements = Values.asTael(list).elements
    const i = Values.asInt(index).content
    if (i < elements.length) {
      elements[i] = value
      return Values.Tael(elements, Values.asTael(list).attributes)
    } else {
      let message = `(list-set) index out of bound\n`
      message += `  list: ${formatValue(list)}\n`
      message += `  index: ${formatValue(index)}\n`
      throw new Error(message)
    }
  })
}
