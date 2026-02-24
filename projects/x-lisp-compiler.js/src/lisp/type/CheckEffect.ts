import assert from "node:assert"
import * as L from "../index.ts"

export type CheckResult =
  | { kind: "Ok"; subst: L.Subst }
  | { kind: "Error"; exp: L.Exp; message: string }

export type CheckEffect = (subst: L.Subst) => CheckResult

export function okCheckEffect(): CheckEffect {
  return (subst) => {
    return {
      kind: "Ok",
      subst,
    }
  }
}

export function errorCheckEffect(exp: L.Exp, message: string): CheckEffect {
  return () => {
    return {
      kind: "Error",
      exp,
      message,
    }
  }
}

export function sequenceCheckEffect(effects: Array<CheckEffect>): CheckEffect {
  assert(effects.length > 0)

  const [effect, ...restEffects] = effects
  if (restEffects.length === 0) return effect
  return (subst) => {
    const result = effect(subst)
    switch (result.kind) {
      case "Ok": {
        return sequenceCheckEffect(restEffects)(result.subst)
      }

      case "Error": {
        return result
      }
    }
  }
}
