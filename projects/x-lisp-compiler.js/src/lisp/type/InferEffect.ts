import * as L from "../index.ts"
import type { CheckEffect } from "./CheckEffect.ts"

export type InferResult =
  | { kind: "InferOk"; subst: L.Subst; type: L.Value }
  | { kind: "InferError"; exp: L.Exp; message: string }

export type InferEffect = (subst: L.Subst) => InferResult

export function okInferEffect(type: L.Value): InferEffect {
  return (subst) => {
    return {
      kind: "InferOk",
      subst,
      type,
    }
  }
}

export function errorInferEffect(exp: L.Exp, message: string): InferEffect {
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
  fn: (type: L.Value) => InferEffect,
): InferEffect {
  return (subst) => {
    const result = effect(subst)

    switch (result.kind) {
      case "InferOk": {
        // console.log("[inferThenInfer]")
        // console.log("subst:")
        // console.log(L.formatSubst(subst))
        // console.log("result.subst:")
        // console.log(L.formatSubst(result.subst))
        // console.log("result.type:", L.formatType(result.type))
        // console.log()
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
  fn: (type: L.Value) => CheckEffect,
): CheckEffect {
  return (subst) => {
    const result = effect(subst)

    switch (result.kind) {
      case "InferOk": {
        // console.log("[inferThenCheck]")
        // console.log("subst:")
        // console.log(L.formatSubst(subst))
        // console.log("result.subst:")
        // console.log(L.formatSubst(result.subst))
        // console.log("result.type:", L.formatType(result.type))
        // console.log()
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
        // console.log("[checkThenInfer]")
        // console.log("subst:")
        // console.log(L.formatSubst(subst))
        // console.log("result.subst:")
        // console.log(L.formatSubst(result.subst))
        // console.log()
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
