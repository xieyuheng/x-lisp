import { evaluate, resultValue } from "../evaluate/index.ts"
import type * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function lazyActive(lazy: Values.Lazy): Value {
  if (lazy.cachedValue !== undefined) {
    return lazy.cachedValue
  }

  const value = resultValue(evaluate(lazy.exp)(lazy.mod, lazy.env))
  lazy.cachedValue = value
  return value
}

export function lazyWalk(value: Value): Value {
  if (value.kind === "Lazy") {
    return lazyWalk(lazyActive(value))
  }

  return value
}
