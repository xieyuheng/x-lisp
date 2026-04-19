import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import { definePrimitiveFunction } from "../define/index.ts"
import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinAssert(mod: Mod) {
  definePrimitiveFunction(mod, "assert", 1, (value) => {
    if (!M.isBoolValue(value)) {
      let message = `(assert) fail on non boolean value`
      message += formatUnderTag(2, `value:`, M.formatValue(value))
      throw new Error(message)
    }

    if (M.isFalseValue(value)) {
      let message = `(assert) fail`
      throw new Error(message)
    }

    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "assert-not", 1, (value) => {
    if (!M.isBoolValue(value)) {
      let message = `(assert-not) fail on non boolean value`
      message += formatUnderTag(2, `value:`, M.formatValue(value))
      throw new Error(message)
    }

    if (M.isTrueValue(value)) {
      let message = `(assert-not) fail`
      throw new Error(message)
    }

    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "assert-equal", 2, (lhs, rhs) => {
    if (!M.valueEqual(lhs, rhs)) {
      let message = `(assert-equal) fail`
      message += formatUnderTag(2, `lhs:`, M.formatValue(lhs))
      message += formatUnderTag(2, `rhs:`, M.formatValue(rhs))
      throw new Error(message)
    }

    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "assert-not-equal", 2, (lhs, rhs) => {
    if (M.valueEqual(lhs, rhs)) {
      let message = `(assert-not-equal) fail`
      message += formatUnderTag(2, `lhs:`, M.formatValue(lhs))
      message += formatUnderTag(2, `rhs:`, M.formatValue(rhs))
      throw new Error(message)
    }

    return M.VoidValue()
  })
}
