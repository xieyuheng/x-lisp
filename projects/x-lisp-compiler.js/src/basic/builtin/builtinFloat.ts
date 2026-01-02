import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

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

  definePrimitiveFunction(mod, "float?", 1)
  definePrimitiveFunction(mod, "float-positive?", 1)
  definePrimitiveFunction(mod, "float-non-negative?", 1)
  definePrimitiveFunction(mod, "float-non-zero?", 1)
  definePrimitiveFunction(mod, "fneg", 1)
  definePrimitiveFunction(mod, "fadd", 2)
  definePrimitiveFunction(mod, "fsub", 2)
  definePrimitiveFunction(mod, "fmul", 2)
  definePrimitiveFunction(mod, "fdiv", 2)
  definePrimitiveFunction(mod, "fmod", 2)
  definePrimitiveFunction(mod, "float-max", 2)
  definePrimitiveFunction(mod, "float-min", 2)
  definePrimitiveFunction(mod, "float-greater?", 2)
  definePrimitiveFunction(mod, "float-less?", 2)
  definePrimitiveFunction(mod, "float-greater-or-equal?", 2)
  definePrimitiveFunction(mod, "float-less-or-equal?", 2)
  definePrimitiveFunction(mod, "float-compare-ascending", 2)
  definePrimitiveFunction(mod, "float-compare-descending", 2)
}
