import * as L from "../index.ts"

export type CheckResult =
  | { kind: "Ok"; subst: L.Subst }
  | { kind: "Error"; message: string }

export type CheckEffect = (subst: L.Subst) => CheckResult
