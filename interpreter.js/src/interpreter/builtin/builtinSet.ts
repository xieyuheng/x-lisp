import { definePrimitiveFunction, provide } from "../define/index.ts"
import { apply, isValid } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinSet(mod: Mod) {
  provide(mod, [
    "set?",
    "set-copy",
    "set-size",
    "set-empty?",
    "set-member?",
    "set-include?",
    "set-to-list",
    "set-add",
    "set-add!",
    "set-delete",
    "set-delete!",
    "set-clear!",
    "set-union",
    "set-inter",
    "set-difference",
    "set-disjoint?",
    "set-map",
    "set-each",
  ])

  definePrimitiveFunction(mod, "set?", 2, (p, target) => {
    if (target.kind !== "Set") {
      return Values.Bool(false)
    }

    for (const element of Values.setElements(target)) {
      if (!isValid(p, element)) {
        return Values.Bool(false)
      }
    }

    return Values.Bool(true)
  })

  definePrimitiveFunction(mod, "set-copy", 1, (set) => {
    return Values.setCopy(set)
  })

  definePrimitiveFunction(mod, "set-size", 1, (value) => {
    return Values.Int(Values.setElements(value).length)
  })

  definePrimitiveFunction(mod, "set-empty?", 1, (value) => {
    return Values.Bool(Values.setElements(value).length === 0)
  })

  definePrimitiveFunction(mod, "set-member?", 2, (value, set) => {
    return Values.Bool(Values.setHas(set, value))
  })

  definePrimitiveFunction(mod, "set-include?", 2, (subset, set) => {
    return Values.Bool(
      Values.setElements(subset).every((value) => Values.setHas(set, value)),
    )
  })

  definePrimitiveFunction(mod, "set-to-list", 1, (set) => {
    return Values.List(Values.setElements(set))
  })

  definePrimitiveFunction(mod, "set-add", 2, (value, set) => {
    const newSet = Values.setCopy(set)
    Values.setAdd(newSet, value)
    return newSet
  })

  definePrimitiveFunction(mod, "set-add!", 2, (value, set) => {
    Values.setAdd(set, value)
    return set
  })

  definePrimitiveFunction(mod, "set-delete", 2, (value, set) => {
    const newSet = Values.setCopy(set)
    Values.setDelete(newSet, value)
    return newSet
  })

  definePrimitiveFunction(mod, "set-delete!", 2, (value, set) => {
    Values.setDelete(set, value)
    return set
  })

  definePrimitiveFunction(mod, "set-clear!", 1, (set) => {
    Values.setDeleteAll(set)
    return set
  })

  definePrimitiveFunction(mod, "set-union", 2, (left, right) => {
    return Values.Set([
      ...Values.setElements(left),
      ...Values.setElements(right),
    ])
  })

  definePrimitiveFunction(mod, "set-inter", 2, (left, right) => {
    return Values.Set(
      Values.setElements(left).filter((element) =>
        Values.setHas(right, element),
      ),
    )
  })

  definePrimitiveFunction(mod, "set-difference", 2, (left, right) => {
    return Values.Set(
      Values.setElements(left).filter(
        (element) => !Values.setHas(right, element),
      ),
    )
  })

  definePrimitiveFunction(mod, "set-disjoint?", 2, (left, right) => {
    return Values.Bool(
      Values.setElements(left).filter((element) =>
        Values.setHas(right, element),
      ).length === 0,
    )
  })

  definePrimitiveFunction(mod, "set-map", 2, (f, set) => {
    return Values.Set(
      Values.setElements(set).map((element) => apply(f, [element])),
    )
  })

  definePrimitiveFunction(mod, "set-each", 2, (f, set) => {
    for (const element of Values.setElements(set)) {
      apply(f, [element])
    }

    return Values.Void()
  })

  definePrimitiveFunction(mod, "set-select", 2, (p, set) => {
    const newSet = Values.Set([])
    for (const element of Values.setElements(set)) {
      const result = apply(p, [element])
      if (!Values.isBool(result)) {
        let message = `(set-select) one result of applying the predicate is not bool`
        message += `\n  predicate: ${formatValue(p)}`
        message += `\n  set: ${formatValue(set)}`
        message += `\n  element: ${formatValue(element)}`
        message += `\n  result: ${formatValue(result)}`
        throw new Error(message)
      }

      if (Values.isTrue(result)) {
        Values.setAdd(newSet, element)
      }
    }

    return newSet
  })
}
