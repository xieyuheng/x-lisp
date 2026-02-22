import * as L from "../index.ts"

export function typeCheck(ctx: L.Ctx, exp: L.Exp, type: L.Value): void {
  switch (exp.kind) {
    // | Lambda

    case "Let1": {
      ctx = L.ctxPut(ctx, exp.name, L.typeInfer(ctx, exp.rhs))
      typeCheck(ctx, exp.body, type)
      return
    }

    // | Begin1

    case "BeginSugar": {
      //
      return
    }

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
      return
    }
  }
}
