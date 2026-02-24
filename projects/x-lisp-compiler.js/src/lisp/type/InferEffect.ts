import * as L from "../index.ts"

export type InferResult =
  | { kind: "Ok"; type: L.Value; subst: L.Subst }
  | { kind: "Error"; message: string }

export type InferEffect = (subst: L.Subst) => InferResult
