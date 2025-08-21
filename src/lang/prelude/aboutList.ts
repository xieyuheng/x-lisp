import { definePrimitiveFunction } from "../define/index.ts"
import { apply } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutList(mod: Mod) {
  definePrimitiveFunction(mod, "list-empty?", 1, (value) => {
    return Values.Bool(Values.asTael(value).elements.length === 0)
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

  definePrimitiveFunction(mod, "car", 1, (list) => {
    if (Values.asTael(list).elements.length === 0) {
      throw new Error("(car) expect target to be non empty list")
    }

    return Values.asTael(list).elements[0]
  })

  definePrimitiveFunction(mod, "cdr", 1, (list) => {
    if (Values.asTael(list).elements.length === 0) {
      throw new Error("(cdr) expect target to be non empty list")
    }

    return Values.Tael(
      Values.asTael(list).elements.slice(1),
      Values.asTael(list).attributes,
    )
  })

  definePrimitiveFunction(mod, "list-head", 1, (list) => {
    if (Values.asTael(list).elements.length === 0) {
      throw new Error("(list-head) expect target to be non empty list")
    }

    return Values.asTael(list).elements[0]
  })

  definePrimitiveFunction(mod, "list-tail", 1, (list) => {
    if (Values.asTael(list).elements.length === 0) {
      throw new Error("(list-tail) expect target to be non empty list")
    }

    return Values.Tael(
      Values.asTael(list).elements.slice(1),
      Values.asTael(list).attributes,
    )
  })

  definePrimitiveFunction(mod, "list-init", 1, (list) => {
    if (Values.asTael(list).elements.length === 0) {
      throw new Error("(list-init) expect target to be non empty list")
    }

    return Values.Tael(
      Values.asTael(list).elements.slice(
        0,
        Values.asTael(list).elements.length - 1,
      ),
      Values.asTael(list).attributes,
    )
  })

  definePrimitiveFunction(mod, "list-last", 1, (list) => {
    if (Values.asTael(list).elements.length === 0) {
      throw new Error("(list-last) expect target to be non empty list")
    }

    return Values.asTael(list).elements[Values.asTael(list).elements.length - 1]
  })

  definePrimitiveFunction(mod, "cons", 2, (head, tail) => {
    return Values.Tael(
      [head, ...Values.asTael(tail).elements],
      Values.asTael(tail).attributes,
    )
  })

  definePrimitiveFunction(mod, "list-length", 1, (list) => {
    return Values.Int(Values.asTael(list).elements.length)
  })

  definePrimitiveFunction(mod, "list-append", 2, (base, list) => {
    return Values.Tael(
      [...Values.asTael(base).elements, ...Values.asTael(list).elements],
      Values.asTael(base).attributes,
    )
  })

  definePrimitiveFunction(mod, "list-of", 1, (list) => {
    return Values.List([...Values.asTael(list).elements])
  })

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

  definePrimitiveFunction(mod, "list-reverse", 1, (list) => {
    return Values.Tael(
      Values.asTael(list).elements.toReversed(),
      Values.asTael(list).attributes,
    )
  })

  runCode(
    mod,
    `\
(define (list-map list f)
  (if (list-empty? list)
    []
    (cons (f (car list)) (list-map (cdr list) f))))
`,
  )
}
