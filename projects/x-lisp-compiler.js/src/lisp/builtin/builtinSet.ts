import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinSet(mod: Mod) {
  provide(mod, [
    "set-copy",
    "set-size",
    "set-empty?",
    "set-member?",
    "set-subset?",
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
  ])

  definePrimitiveFunction(mod, "set-copy", 1, (set) => {
    return Values.setCopy(set)
  })

  definePrimitiveFunction(mod, "set-size", 1, (value) => {
    return Values.IntValue(BigInt(Values.setElements(value).length))
  })

  definePrimitiveFunction(mod, "set-empty?", 1, (value) => {
    return Values.BoolValue(Values.setElements(value).length === 0)
  })

  definePrimitiveFunction(mod, "set-member?", 2, (value, set) => {
    return Values.BoolValue(Values.setHas(set, value))
  })

  definePrimitiveFunction(mod, "set-subset?", 2, (subset, set) => {
    return Values.BoolValue(
      Values.setElements(subset).every((value) => Values.setHas(set, value)),
    )
  })

  definePrimitiveFunction(mod, "set-to-list", 1, (set) => {
    return Values.ListValue(Values.setElements(set))
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
    return Values.SetValue([
      ...Values.setElements(left),
      ...Values.setElements(right),
    ])
  })

  definePrimitiveFunction(mod, "set-inter", 2, (left, right) => {
    return Values.SetValue(
      Values.setElements(left).filter((element) =>
        Values.setHas(right, element),
      ),
    )
  })

  definePrimitiveFunction(mod, "set-difference", 2, (left, right) => {
    return Values.SetValue(
      Values.setElements(left).filter(
        (element) => !Values.setHas(right, element),
      ),
    )
  })

  definePrimitiveFunction(mod, "set-disjoint?", 2, (left, right) => {
    return Values.BoolValue(
      Values.setElements(left).filter((element) =>
        Values.setHas(right, element),
      ).length === 0,
    )
  })
}
