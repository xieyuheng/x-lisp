import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import * as L from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinAssert(mod: Mod) {
  provide(mod, ["assert", "assert-not", "assert-equal", "assert-not-equal"])

  definePrimitiveFunction(mod, "assert", 1, (value) => {
    if (!L.isBoolValue(value)) {
      let message = `(assert) fail on non boolean value`
      message += formatUnderTag(2, `value:`, L.formatValue(value))
      throw new Error(message)
    }

    if (L.isFalseValue(value)) {
      let message = `(assert) fail`
      throw new Error(message)
    }

    return L.VoidValue()
  })

  definePrimitiveFunction(mod, "assert-not", 1, (value) => {
    if (!L.isBoolValue(value)) {
      let message = `(assert-not) fail on non boolean value`
      message += formatUnderTag(2, `value:`, L.formatValue(value))
      throw new Error(message)
    }

    if (L.isTrueValue(value)) {
      let message = `(assert-not) fail`
      throw new Error(message)
    }

    return L.VoidValue()
  })

  definePrimitiveFunction(mod, "assert-equal", 2, (lhs, rhs) => {
    if (!L.equal(lhs, rhs)) {
      let message = `(assert-equal) fail`
      message += formatUnderTag(2, `lhs:`, L.formatValue(lhs))
      message += formatUnderTag(2, `rhs:`, L.formatValue(rhs))
      throw new Error(message)
    }

    return L.VoidValue()
  })

  definePrimitiveFunction(mod, "assert-not-equal", 2, (lhs, rhs) => {
    if (L.equal(lhs, rhs)) {
      let message = `(assert-not-equal) fail`
      message += formatUnderTag(2, `lhs:`, L.formatValue(lhs))
      message += formatUnderTag(2, `rhs:`, L.formatValue(rhs))
      throw new Error(message)
    }

    return L.VoidValue()
  })
}
