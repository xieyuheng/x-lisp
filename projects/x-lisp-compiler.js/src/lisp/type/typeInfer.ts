import assert from "node:assert"
import * as L from "../index.ts"

export function typeInfer(ctx: L.Ctx, exp: L.Exp): L.Value {
  switch (exp.kind) {
      // | Symbol
      // | Hashtag
      // | String
      // | Int
      // | Float
      // | Var
      // | Lambda
      // | Apply
      // | Let1
      // | Begin1
      // | BeginSugar
      // | AssignSugar
      // | If
      // | When
      // | Unless
      // | And
      // | Or
      // | Cond
      // | Tael
      // | Set
      // | Hash
      // | Quote

    default: {
      let message = `[typeInfer] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      throw new Error(message)
    }
  }
}
