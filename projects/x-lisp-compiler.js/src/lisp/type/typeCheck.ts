import * as L from "../index.ts"

export function typeCheck(ctx: L.Ctx, exp: L.Exp, type: L.Value): void {
  switch (exp.kind) {
    // | Lambda
    // | Let1
    // | Begin1
    // | BeginSugar
    // | AssignSugar
    // | If
    // | When
    // | Unless
    // | Cond
    // | Tael
    // | Set
    // | Hash
    // | Quote
    default: {
      L.typeSubtype([], L.typeInfer(ctx, exp), type)
    }
  }
}
