import { definePrimitiveFunction, provide } from "../define/index.ts"
import { equal } from "../equal/index.ts"
import { apply } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutSet(mod: Mod) {
  provide(mod, [
    "set?",
    "set-empty?",
    "set-size",
    "set-member?",
    "set-include?",
    "set-to-list",
    "set-add",
    "set-add!",
    "set-remove",
    "set-remove!",
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

    for (const element of Values.asSet(target).elements) {
      const result = apply(p, [element])
      if (result.kind !== "Bool") {
        let message = `(set?) one result of applying the predicate is not bool\n`
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

  definePrimitiveFunction(mod, "set-empty?", 1, (value) => {
    return Values.Bool(Values.asSet(value).elements.length === 0)
  })

  definePrimitiveFunction(mod, "set-size", 1, (value) => {
    return Values.Int(Values.asSet(value).elements.length)
  })

  definePrimitiveFunction(mod, "set-member?", 2, (value, set) => {
    return Values.Bool(
      Values.valueArrayMember(value, Values.asSet(set).elements),
    )
  })

  definePrimitiveFunction(mod, "set-include?", 2, (subset, set) => {
    return Values.Bool(
      Values.asSet(subset).elements.every((value) =>
        Values.valueArrayMember(value, Values.asSet(set).elements),
      ),
    )
  })

  definePrimitiveFunction(mod, "set-to-list", 1, (set) => {
    return Values.List(Values.asSet(set).elements)
  })

  definePrimitiveFunction(mod, "set-add", 2, (value, set) => {
    return Values.Set(
      Values.valueArrayDedup([...Values.asSet(set).elements, value]),
    )
  })

  definePrimitiveFunction(mod, "set-add!", 2, (value, set) => {
    Values.asSet(set).elements.push(value)
    return Values.Set(Values.valueArrayDedup(Values.asSet(set).elements))
  })

  definePrimitiveFunction(mod, "set-remove", 2, (value, set) => {
    return Values.Set(
      Values.asSet(set).elements.filter((element) => !equal(value, element)),
    )
  })

  definePrimitiveFunction(mod, "set-remove!", 2, (value, set) => {
    Values.asSet(set).elements = Values.asSet(set).elements.filter(
      (element) => !equal(value, element),
    )
    return set
  })

  definePrimitiveFunction(mod, "set-clear!", 1, (set) => {
    Values.asSet(set).elements = []
    return set
  })

  definePrimitiveFunction(mod, "set-union", 2, (left, right) => {
    return Values.Set(
      Values.valueArrayDedup([
        ...Values.asSet(left).elements,
        ...Values.asSet(right).elements,
      ]),
    )
  })

  definePrimitiveFunction(mod, "set-inter", 2, (left, right) => {
    return Values.Set(
      Values.asSet(left).elements.filter((element) =>
        Values.valueArrayMember(element, Values.asSet(right).elements),
      ),
    )
  })

  definePrimitiveFunction(mod, "set-difference", 2, (left, right) => {
    return Values.Set(
      Values.asSet(left).elements.filter(
        (element) =>
          !Values.valueArrayMember(element, Values.asSet(right).elements),
      ),
    )
  })

  definePrimitiveFunction(mod, "set-disjoint?", 2, (left, right) => {
    return Values.Bool(
      Values.asSet(left).elements.filter((element) =>
        Values.valueArrayMember(element, Values.asSet(right).elements),
      ).length === 0,
    )
  })

  definePrimitiveFunction(mod, "set-map", 2, (f, set) => {
    return Values.Set(
      Values.asSet(set).elements.map((element) => apply(f, [element])),
    )
  })

  definePrimitiveFunction(mod, "set-each", 2, (f, set) => {
    for (const element of Values.asSet(set).elements) {
      Values.lazyWalk(apply(f, [element]))
    }

    return Values.Void()
  })
}
