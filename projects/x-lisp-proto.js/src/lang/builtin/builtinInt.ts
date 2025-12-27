import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinInt(mod: Mod) {
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
    "int-greater?",
    "int-less?",
    "int-greater-or-equal?",
    "int-less-or-equal?",
    "int-compare-ascending",
    "int-compare-descending",
  ])

  definePrimitiveFunction(mod, "int?", 1, (value) => {
    return Values.Bool(Values.isInt(value))
  })

  definePrimitiveFunction(mod, "int-positive?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content > 0)
  })

  definePrimitiveFunction(mod, "int-non-negative?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content >= 0)
  })

  definePrimitiveFunction(mod, "int-non-zero?", 1, (x) => {
    return Values.Bool(Values.isInt(x) && Values.asInt(x).content !== 0n)
  })

  definePrimitiveFunction(mod, "ineg", 1, (x) => {
    return Values.Int(-Values.asInt(x).content)
  })

  definePrimitiveFunction(mod, "iadd", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content + Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "isub", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content - Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "imul", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content * Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "idiv", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content / Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "imod", 2, (x, y) => {
    return Values.Int(Values.asInt(x).content % Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "int-max", 2, (x, y) => {
    if (Values.asInt(x).content > Values.asInt(y).content) {
      return Values.Int(Values.asInt(x).content)
    } else {
      return Values.Int(Values.asInt(y).content)
    }
  })

  definePrimitiveFunction(mod, "int-min", 2, (x, y) => {
    if (Values.asInt(x).content < Values.asInt(y).content) {
      return Values.Int(Values.asInt(x).content)
    } else {
      return Values.Int(Values.asInt(y).content)
    }
  })

  definePrimitiveFunction(mod, "int-greater?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content > Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "int-less?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content < Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "int-greater-or-equal?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content >= Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "int-less-or-equal?", 2, (x, y) => {
    return Values.Bool(Values.asInt(x).content <= Values.asInt(y).content)
  })

  definePrimitiveFunction(mod, "int-compare-ascending", 2, (x, y) => {
    if (Values.asInt(x).content < Values.asInt(y).content) {
      return Values.Int(-1n)
    } else if (Values.asInt(x).content > Values.asInt(y).content) {
      return Values.Int(1n)
    } else {
      return Values.Int(0n)
    }
  })

  definePrimitiveFunction(mod, "int-compare-descending", 2, (x, y) => {
    if (Values.asInt(x).content < Values.asInt(y).content) {
      return Values.Int(1n)
    } else if (Values.asInt(x).content > Values.asInt(y).content) {
      return Values.Int(-1n)
    } else {
      return Values.Int(0n)
    }
  })
}
