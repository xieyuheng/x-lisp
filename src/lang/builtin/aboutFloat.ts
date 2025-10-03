import { definePrimitiveFunction, provide } from "../define/index.ts"
import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFloat(mod: Mod) {
  provide(mod, [
    "float?",
    "float-positive?",
    "float-non-negative?",
    "float-non-zero?",
    "fneg",
    "fadd",
    "fsub",
    "fmul",
    "fdiv",
    "float-max",
    "float-min",
    "float-larger?",
    "float-smaller?",
    "float-larger-or-equal?",
    "float-smaller-or-equal?",
    "float-compare/ascending",
    "float-compare/descending",
  ])

  definePrimitiveFunction(mod, "float?", 1, (value) => {
    return Values.Bool(Values.isFloat(value))
  })

  definePrimitiveFunction(mod, "float-positive?", 1, (x) => {
    return Values.Bool(Values.asFloat(x).content > 0)
  })

  definePrimitiveFunction(mod, "float-non-negative?", 1, (x) => {
    return Values.Bool(Values.asFloat(x).content >= 0)
  })

  definePrimitiveFunction(mod, "float-non-zero?", 1, (x) => {
    return Values.Bool(Values.asFloat(x).content !== 0)
  })

  runCode(mod, `(claim fneg (-> float? float?))`)
  definePrimitiveFunction(mod, "fneg", 1, (x) => {
    return Values.Float(-Values.asFloat(x).content)
  })

  runCode(mod, `(claim fadd (-> float? float? float?))`)
  definePrimitiveFunction(mod, "fadd", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content + Values.asFloat(y).content)
  })

  runCode(mod, `(claim fsub (-> float? float? float?))`)
  definePrimitiveFunction(mod, "fsub", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content - Values.asFloat(y).content)
  })

  runCode(mod, `(claim fmul (-> float? float? float?))`)
  definePrimitiveFunction(mod, "fmul", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content * Values.asFloat(y).content)
  })

  runCode(mod, `(claim fdiv (-> float? float-non-zero? float?))`)
  definePrimitiveFunction(mod, "fdiv", 2, (x, y) => {
    return Values.Float(Values.asFloat(x).content / Values.asFloat(y).content)
  })

  runCode(mod, `(claim float-max (-> float? float? float?))`)
  definePrimitiveFunction(mod, "float-max", 2, (x, y) => {
    return Values.Float(
      Math.max(Values.asFloat(x).content, Values.asFloat(y).content),
    )
  })

  runCode(mod, `(claim float-min (-> float? float? float?))`)
  definePrimitiveFunction(mod, "float-min", 2, (x, y) => {
    return Values.Float(
      Math.min(Values.asFloat(x).content, Values.asFloat(y).content),
    )
  })

  runCode(mod, `(claim float-larger? (-> float? float? bool?))`)
  definePrimitiveFunction(mod, "float-larger?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content > Values.asFloat(y).content)
  })

  runCode(mod, `(claim float-smaller? (-> float? float? bool?))`)
  definePrimitiveFunction(mod, "float-smaller?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content < Values.asFloat(y).content)
  })

  runCode(mod, `(claim float-larger-or-equal? (-> float? float? bool?))`)
  definePrimitiveFunction(mod, "float-larger-or-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content >= Values.asFloat(y).content)
  })

  runCode(mod, `(claim float-small-or-equal? (-> float? float? bool?))`)
  definePrimitiveFunction(mod, "float-smaller-or-equal?", 2, (x, y) => {
    return Values.Bool(Values.asFloat(x).content <= Values.asFloat(y).content)
  })

  runCode(mod, `(claim float-compare/ascending (-> float? float? int?))`)
  definePrimitiveFunction(mod, "float-compare/ascending", 2, (x, y) => {
    if (Values.asFloat(x).content < Values.asFloat(y).content) {
      return Values.Int(-1)
    } else if (Values.asFloat(x).content > Values.asFloat(y).content) {
      return Values.Int(1)
    } else {
      return Values.Int(0)
    }
  })

  runCode(mod, `(claim float-compare/descending (-> float? float? int?))`)
  definePrimitiveFunction(mod, "float-compare/descending", 2, (x, y) => {
    if (Values.asFloat(x).content < Values.asFloat(y).content) {
      return Values.Int(1)
    } else if (Values.asFloat(x).content > Values.asFloat(y).content) {
      return Values.Int(-1)
    } else {
      return Values.Int(0)
    }
  })
}
