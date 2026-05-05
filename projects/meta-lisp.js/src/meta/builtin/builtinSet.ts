import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinSet(mod: Mod) {
  definePrimitiveFunction(mod, "make-set", 0, () => {
    return Values.SetValue([])
  })

  definePrimitiveFunction(mod, "set-copy", 1, (set) => {
    return Values.setValueCopy(set)
  })

  definePrimitiveFunction(mod, "set-size", 1, (value) => {
    return Values.IntValue(BigInt(Values.setValueElements(value).length))
  })

  definePrimitiveFunction(mod, "set-empty?", 1, (value) => {
    return Values.BoolValue(Values.setValueElements(value).length === 0)
  })

  definePrimitiveFunction(mod, "set-member?", 2, (value, set) => {
    return Values.BoolValue(Values.setValueHas(set, value))
  })

  definePrimitiveFunction(mod, "set-subset?", 2, (subset, set) => {
    return Values.BoolValue(
      Values.setValueElements(subset).every((value) =>
        Values.setValueHas(set, value),
      ),
    )
  })

  definePrimitiveFunction(mod, "set-to-list", 1, (set) => {
    return Values.ListValue(Values.setValueElements(set))
  })

  definePrimitiveFunction(mod, "set-add", 2, (value, set) => {
    const newSet = Values.setValueCopy(set)
    Values.setValueAdd(newSet, value)
    return newSet
  })

  definePrimitiveFunction(mod, "set-add!", 2, (value, set) => {
    Values.setValueAdd(set, value)
    return set
  })

  definePrimitiveFunction(mod, "set-delete", 2, (value, set) => {
    const newSet = Values.setValueCopy(set)
    Values.setValueDelete(newSet, value)
    return newSet
  })

  definePrimitiveFunction(mod, "set-delete!", 2, (value, set) => {
    Values.setValueDelete(set, value)
    return set
  })

  definePrimitiveFunction(mod, "set-clear!", 1, (set) => {
    Values.setValueClear(set)
    return set
  })

  definePrimitiveFunction(mod, "set-union", 2, (left, right) => {
    return Values.SetValue([
      ...Values.setValueElements(left),
      ...Values.setValueElements(right),
    ])
  })

  definePrimitiveFunction(mod, "set-inter", 2, (left, right) => {
    return Values.SetValue(
      Values.setValueElements(left).filter((element) =>
        Values.setValueHas(right, element),
      ),
    )
  })

  definePrimitiveFunction(mod, "set-difference", 2, (left, right) => {
    return Values.SetValue(
      Values.setValueElements(left).filter(
        (element) => !Values.setValueHas(right, element),
      ),
    )
  })

  definePrimitiveFunction(mod, "set-disjoint?", 2, (left, right) => {
    return Values.BoolValue(
      Values.setValueElements(left).filter((element) =>
        Values.setValueHas(right, element),
      ).length === 0,
    )
  })
}
