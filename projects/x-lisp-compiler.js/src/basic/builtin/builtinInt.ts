import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

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

  definePrimitiveFunction(mod, "int?", 1)
  definePrimitiveFunction(mod, "int-positive?", 1)
  definePrimitiveFunction(mod, "int-non-negative?", 1)
  definePrimitiveFunction(mod, "int-non-zero?", 1)
  definePrimitiveFunction(mod, "ineg", 1)
  definePrimitiveFunction(mod, "iadd", 2)
  definePrimitiveFunction(mod, "isub", 2)
  definePrimitiveFunction(mod, "imul", 2)
  definePrimitiveFunction(mod, "idiv", 2)
  definePrimitiveFunction(mod, "imod", 2)
  definePrimitiveFunction(mod, "int-max", 2)
  definePrimitiveFunction(mod, "int-min", 2)
  definePrimitiveFunction(mod, "int-greater?", 2)
  definePrimitiveFunction(mod, "int-less?", 2)
  definePrimitiveFunction(mod, "int-greater-or-equal?", 2)
  definePrimitiveFunction(mod, "int-less-or-equal?", 2)
  definePrimitiveFunction(mod, "int-compare-ascending", 2)
  definePrimitiveFunction(mod, "int-compare-descending", 2)
}
