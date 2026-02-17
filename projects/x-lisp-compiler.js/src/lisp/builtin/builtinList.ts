import { definePrimitiveFunction, provide } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinList(mod: Mod) {
  provide(mod, [
    "list-empty?",
    "car",
    "cdr",
    "cons",
    "list-head",
    "list-tail",
    "list-init",
    "list-last",
    "list-length",
    "list-copy",
    "list-get",
    "list-put",
    "list-put!",
    "list-push",
    "list-push!",
    "list-pop!",
    "list-shift!",
    "list-unshift!",
    "list-reverse",
    "list-to-set",
  ])

  definePrimitiveFunction(mod, "list-empty?", 1, (value) => {
    return Values.BoolValue(Values.asTaelValue(value).elements.length === 0)
  })

  definePrimitiveFunction(mod, "car", 1, (list) => {
    if (Values.asTaelValue(list).elements.length === 0) {
      throw new Error("(car) expect target to be non empty list")
    }

    return Values.asTaelValue(list).elements[0]
  })

  definePrimitiveFunction(mod, "cdr", 1, (list) => {
    if (Values.asTaelValue(list).elements.length === 0) {
      throw new Error("(cdr) expect target to be non empty list")
    }

    return Values.TaelValue(
      Values.asTaelValue(list).elements.slice(1),
      Values.asTaelValue(list).attributes,
    )
  })

  definePrimitiveFunction(mod, "cons", 2, (head, tail) => {
    return Values.TaelValue(
      [head, ...Values.asTaelValue(tail).elements],
      Values.asTaelValue(tail).attributes,
    )
  })

  definePrimitiveFunction(mod, "list-head", 1, (list) => {
    if (Values.asTaelValue(list).elements.length === 0) {
      throw new Error("(list-head) expect target to be non empty list")
    }

    return Values.asTaelValue(list).elements[0]
  })

  definePrimitiveFunction(mod, "list-tail", 1, (list) => {
    if (Values.asTaelValue(list).elements.length === 0) {
      throw new Error("(list-tail) expect target to be non empty list")
    }

    return Values.TaelValue(
      Values.asTaelValue(list).elements.slice(1),
      Values.asTaelValue(list).attributes,
    )
  })

  definePrimitiveFunction(mod, "list-init", 1, (list) => {
    if (Values.asTaelValue(list).elements.length === 0) {
      throw new Error("(list-init) expect target to be non empty list")
    }

    return Values.TaelValue(
      Values.asTaelValue(list).elements.slice(
        0,
        Values.asTaelValue(list).elements.length - 1,
      ),
      Values.asTaelValue(list).attributes,
    )
  })

  definePrimitiveFunction(mod, "list-last", 1, (list) => {
    if (Values.asTaelValue(list).elements.length === 0) {
      throw new Error("(list-last) expect target to be non empty list")
    }

    return Values.asTaelValue(list).elements[
      Values.asTaelValue(list).elements.length - 1
    ]
  })

  definePrimitiveFunction(mod, "list-length", 1, (list) => {
    return Values.IntValue(BigInt(Values.asTaelValue(list).elements.length))
  })

  definePrimitiveFunction(mod, "list-copy", 1, (list) => {
    return Values.ListValue([...Values.asTaelValue(list).elements])
  })

  definePrimitiveFunction(mod, "list-get", 2, (index, list) => {
    const elements = Values.asTaelValue(list).elements
    const i = Values.asIntValue(index).content
    if (i < elements.length) {
      return elements[Number(i)]
    } else {
      let message = `(list-get) index out of bound`
      message += `\n  index: ${formatValue(index)}`
      message += `\n  list: ${formatValue(list)}`
      throw new Error(message)
    }
  })

  definePrimitiveFunction(mod, "list-put", 3, (index, value, list) => {
    const elements = Array.from(Values.asTaelValue(list).elements)
    const i = Values.asIntValue(index).content
    if (i >= elements.length) {
      let message = `(list-put) index out of bound`
      message += `\n  list: ${formatValue(list)}`
      message += `\n  index: ${formatValue(index)}`
      throw new Error(message)
    }

    elements[Number(i)] = value
    return Values.TaelValue(elements, Values.asTaelValue(list).attributes)
  })

  definePrimitiveFunction(mod, "list-put!", 3, (index, value, list) => {
    const elements = Values.asTaelValue(list).elements
    const i = Values.asIntValue(index).content
    if (i >= elements.length) {
      let message = `(list-put!) index out of bound`
      message += `\n  list: ${formatValue(list)}`
      message += `\n  index: ${formatValue(index)}`
      throw new Error(message)
    }

    elements[Number(i)] = value
    return list
  })

  definePrimitiveFunction(mod, "list-push", 2, (value, list) => {
    return Values.ListValue([...Values.asTaelValue(list).elements, value])
  })

  definePrimitiveFunction(mod, "list-push!", 2, (value, list) => {
    Values.asTaelValue(list).elements.push(value)
    return list
  })

  definePrimitiveFunction(mod, "list-pop!", 1, (list) => {
    const value = Values.asTaelValue(list).elements.pop()
    if (value === undefined) {
      return Values.NullValue()
    } else {
      return value
    }
  })

  definePrimitiveFunction(mod, "list-unshift!", 2, (value, list) => {
    Values.asTaelValue(list).elements.unshift(value)
    return list
  })

  definePrimitiveFunction(mod, "list-shift!", 1, (list) => {
    const value = Values.asTaelValue(list).elements.shift()
    if (value === undefined) {
      return Values.NullValue()
    } else {
      return value
    }
  })

  definePrimitiveFunction(mod, "list-reverse", 1, (list) => {
    return Values.TaelValue(
      Values.asTaelValue(list).elements.toReversed(),
      Values.asTaelValue(list).attributes,
    )
  })

  definePrimitiveFunction(mod, "list-to-set", 1, (list) => {
    return Values.SetValue(Values.asTaelValue(list).elements)
  })
}
