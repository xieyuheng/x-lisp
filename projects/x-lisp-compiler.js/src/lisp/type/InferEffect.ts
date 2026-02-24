import assert from "node:assert"
import * as L from "../index.ts"

export type InferResult =
  | { kind: "Ok"; subst: L.Subst; type: L.Value }
  | { kind: "Error"; message: string }

export type InferEffect = (subst: L.Subst) => InferResult

export function okInferEffect(type: L.Value): InferEffect {
  return (subst) => {
    return {
      kind: "Ok",
      subst,
      type,
    }
  }
}

export function errorInferEffect(exp: L.Exp, message: string): InferEffect {
  return () => {
    return {
      kind: "Error",
      exp,
      message,
    }
  }
}

export function sequenceInferEffect(effects: Array<InferEffect>): InferEffect {
  assert(effects.length > 0)

  const [effect, ...restEffects] = effects

  if (restEffects.length === 0) {
    return effect
  }

  return (subst) => {
    const result = effect(subst)
    switch (result.kind) {
      case "Ok": {
        return sequenceInferEffect(restEffects)(result.subst)
      }

      case "Error": {
        return result
      }
    }
  }
}
