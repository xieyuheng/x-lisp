import { definePrimitiveFunction, provide } from "../define/index.ts"
import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutInt(mod: Mod) {
  provide(mod, [
    "int?",
    "int-positive?",
    "int-non-negative?",
    "int-non-zero?",
    "ineg",
    "iadd",
    "isub",
    "imul",
    "idiv",
    "imod",
    "int-max",
    "int-min",
    "int-larger?",
    "int-smaller?",
    "int-larger-or-equal?",
    "int-smaller-or-equal?",
    "int-compare/ascending",
    "int-compare/descending",
  ])

  definePrimitiveFunction(mod, "int?", 1, (value) => {
    return Values.Bool(Values.isInt(value))
  })

  runCode(mod, `(claim int-positive? (-> int? bool?))`)
  definePrimitiveFunction(mod, "int-positive?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content > 0)
  })

  runCode(mod, `(claim int-non-negative? (-> int? bool?))`)
  definePrimitiveFunction(mod, "int-non-negative?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content >= 0)
  })

  runCode(mod, `(claim int-non-zero? (-> int? bool?))`)
  definePrimitiveFunction(mod, "int-non-zero?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content !== 0)
  })

  runCode(mod, `(claim ineg (-> int? int?))`)
  definePrimitiveFunction(mod, "ineg", 1, (x) => {
    return Values.Int(-Values.asInt(x).content)
  })

  runCode(mod, `(claim iadd (-> int? int? int?))`)
  definePrimitiveFunction(mod, "iadd", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content + Values.asInt(y).content)
  })

  runCode(mod, `(claim isub (-> int? int? int?))`)
  definePrimitiveFunction(mod, "isub", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content - Values.asInt(y).content)
  })

  runCode(mod, `(claim imul (-> int? int? int?))`)
  definePrimitiveFunction(mod, "imul", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content * Values.asInt(y).content)
  })

  runCode(mod, `(claim idiv (-> int? int-non-zero? int?))`)
  definePrimitiveFunction(mod, "idiv", 2, (x, y) => {
    return Values.Int(
      Math.trunc(Values.asInt(x).content / Values.asInt(y).content),
    )
  })

  runCode(mod, `(claim imod (-> int? int-non-zero? int?))`)
  definePrimitiveFunction(mod, "imod", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content % Values.asInt(y).content)
  })

  runCode(mod, `(claim int-max (-> int? int? int?))`)
  definePrimitiveFunction(mod, "int-max", 2, (x, y) => {
    return Values.Int(
      Math.max(Values.asInt(x).content, Values.asInt(y).content),
    )
  })

  runCode(mod, `(claim int-min (-> int? int? int?))`)
  definePrimitiveFunction(mod, "int-min", 2, (x, y) => {
    return Values.Int(
      Math.min(Values.asInt(x).content, Values.asInt(y).content),
    )
  })

  runCode(mod, `(claim int-larger? (-> int? int? bool?))`)
  definePrimitiveFunction(mod, "int-larger?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content > Values.asInt(y).content)
  })

  runCode(mod, `(claim int-smaller? (-> int? int? bool?))`)
  definePrimitiveFunction(mod, "int-smaller?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content < Values.asInt(y).content)
  })

  runCode(mod, `(claim int-larger-or-equal? (-> int? int? bool?))`)
  definePrimitiveFunction(mod, "int-larger-or-equal?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content >= Values.asInt(y).content)
  })

  runCode(mod, `(claim int-smaller-or-equal? (-> int? int? bool?))`)
  definePrimitiveFunction(mod, "int-smaller-or-equal?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content <= Values.asInt(y).content)
  })

  runCode(mod, `(claim int-compare/ascending (-> int? int? int?))`)
  definePrimitiveFunction(mod, "int-compare/ascending", 2, (x, y) => {
    if (Values.asInt(x).content < Values.asInt(y).content) {
      return Values.Int(-1)
    } else if (Values.asInt(x).content > Values.asInt(y).content) {
      return Values.Int(1)
    } else {
      return Values.Int(0)
    }
  })

  runCode(mod, `(claim int-compare/descending (-> int? int? int?))`)
  definePrimitiveFunction(mod, "int-compare/descending", 2, (x, y) => {
    if (Values.asInt(x).content < Values.asInt(y).content) {
      return Values.Int(1)
    } else if (Values.asInt(x).content > Values.asInt(y).content) {
      return Values.Int(-1)
    } else {
      return Values.Int(0)
    }
  })
}
