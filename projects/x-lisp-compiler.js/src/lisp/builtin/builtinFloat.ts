import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinFloat(mod: Mod) {
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
    "fmod",
    "float-max",
    "float-min",
    "float-greater?",
    "float-less?",
    "float-greater-or-equal?",
    "float-less-or-equal?",
    "float-compare-ascending",
    "float-compare-descending",
  ])

  definePrimitiveFunction(mod, "float?", 1, (value) => {
    return Values.BoolValue(Values.isFloatValue(value))
  })

  definePrimitiveFunction(mod, "float-positive?", 1, (x) => {
    return Values.BoolValue(
      Values.isFloatValue(x) && Values.asFloatValue(x).content > 0,
    )
  })

  definePrimitiveFunction(mod, "float-non-negative?", 1, (x) => {
    return Values.BoolValue(
      Values.isFloatValue(x) && Values.asFloatValue(x).content >= 0,
    )
  })

  definePrimitiveFunction(mod, "float-non-zero?", 1, (x) => {
    return Values.BoolValue(
      Values.isFloatValue(x) && Values.asFloatValue(x).content !== 0,
    )
  })

  definePrimitiveFunction(mod, "fneg", 1, (x) => {
    return Values.FloatValue(-Values.asFloatValue(x).content)
  })

  definePrimitiveFunction(mod, "fadd", 2, (x, y) => {
    return Values.FloatValue(
      Values.asFloatValue(x).content + Values.asFloatValue(y).content,
    )
  })

  definePrimitiveFunction(mod, "fsub", 2, (x, y) => {
    return Values.FloatValue(
      Values.asFloatValue(x).content - Values.asFloatValue(y).content,
    )
  })

  definePrimitiveFunction(mod, "fmul", 2, (x, y) => {
    return Values.FloatValue(
      Values.asFloatValue(x).content * Values.asFloatValue(y).content,
    )
  })

  definePrimitiveFunction(mod, "fdiv", 2, (x, y) => {
    return Values.FloatValue(
      Values.asFloatValue(x).content / Values.asFloatValue(y).content,
    )
  })

  definePrimitiveFunction(mod, "fmod", 2, (x, y) => {
    return Values.FloatValue(
      Values.asFloatValue(x).content % Values.asFloatValue(y).content,
    )
  })

  definePrimitiveFunction(mod, "float-max", 2, (x, y) => {
    return Values.FloatValue(
      Math.max(Values.asFloatValue(x).content, Values.asFloatValue(y).content),
    )
  })

  definePrimitiveFunction(mod, "float-min", 2, (x, y) => {
    return Values.FloatValue(
      Math.min(Values.asFloatValue(x).content, Values.asFloatValue(y).content),
    )
  })

  definePrimitiveFunction(mod, "float-greater?", 2, (x, y) => {
    return Values.BoolValue(
      Values.asFloatValue(x).content > Values.asFloatValue(y).content,
    )
  })

  definePrimitiveFunction(mod, "float-less?", 2, (x, y) => {
    return Values.BoolValue(
      Values.asFloatValue(x).content < Values.asFloatValue(y).content,
    )
  })

  definePrimitiveFunction(mod, "float-greater-or-equal?", 2, (x, y) => {
    return Values.BoolValue(
      Values.asFloatValue(x).content >= Values.asFloatValue(y).content,
    )
  })

  definePrimitiveFunction(mod, "float-less-or-equal?", 2, (x, y) => {
    return Values.BoolValue(
      Values.asFloatValue(x).content <= Values.asFloatValue(y).content,
    )
  })

  definePrimitiveFunction(mod, "float-compare-ascending", 2, (x, y) => {
    if (Values.asFloatValue(x).content < Values.asFloatValue(y).content) {
      return Values.IntValue(-1n)
    } else if (
      Values.asFloatValue(x).content > Values.asFloatValue(y).content
    ) {
      return Values.IntValue(1n)
    } else {
      return Values.IntValue(0n)
    }
  })

  definePrimitiveFunction(mod, "float-compare-descending", 2, (x, y) => {
    if (Values.asFloatValue(x).content < Values.asFloatValue(y).content) {
      return Values.IntValue(1n)
    } else if (
      Values.asFloatValue(x).content > Values.asFloatValue(y).content
    ) {
      return Values.IntValue(-1n)
    } else {
      return Values.IntValue(0n)
    }
  })
}
