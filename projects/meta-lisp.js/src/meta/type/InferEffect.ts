import * as M from "../index.ts"
import type { CheckEffect } from "./CheckEffect.ts"

export type InferResult =
  | { kind: "InferOk"; subst: M.Subst; type: M.Value }
  | { kind: "InferError"; exp: M.Exp; message: string }

export type InferEffect = (subst: M.Subst) => InferResult

export function okInferEffect(type: M.Value): InferEffect {
  return (subst) => {
    return {
      kind: "InferOk",
      subst,
      type,
    }
  }
}

export function errorInferEffect(exp: M.Exp, message: string): InferEffect {
  return () => {
    return {
      kind: "InferError",
      exp,
      message,
    }
  }
}

export function inferThenInfer(
  effect: InferEffect,
  fn: (type: M.Value) => InferEffect,
): InferEffect {
  return (subst) => {
    const result = effect(subst)

    switch (result.kind) {
      case "InferOk": {
        return fn(result.type)(result.subst)
      }

      case "InferError": {
        return result
      }
    }
  }
}

export function inferThenCheck(
  effect: InferEffect,
  fn: (type: M.Value) => CheckEffect,
): CheckEffect {
  return (subst) => {
    const result = effect(subst)

    switch (result.kind) {
      case "InferOk": {
        return fn(result.type)(result.subst)
      }

      case "InferError": {
        return {
          kind: "CheckError",
          exp: result.exp,
          message: result.message,
        }
      }
    }
  }
}

export function checkThenInfer(
  checkEffect: CheckEffect,
  inferEffect: InferEffect,
): InferEffect {
  return (subst) => {
    const result = checkEffect(subst)

    switch (result.kind) {
      case "CheckOk": {
        return inferEffect(result.subst)
      }

      case "CheckError": {
        return {
          kind: "InferError",
          exp: result.exp,
          message: result.message,
        }
      }
    }
  }
}
