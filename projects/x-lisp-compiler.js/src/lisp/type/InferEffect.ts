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
