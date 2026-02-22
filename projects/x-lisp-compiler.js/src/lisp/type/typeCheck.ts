import assert from "node:assert"
import * as L from "../index.ts"

export function typeCheck(ctx: L.Ctx, exp: L.Exp, type: L.Value): void {
  switch (exp.kind) {
    // | Lambda

    case "Let1": {
      ctx = L.ctxPut(ctx, exp.name, L.typeInfer(ctx, exp.rhs))
      typeCheck(ctx, exp.body, type)
      return
    }

    case "Begin1": {
      typeCheck(ctx, exp.head, L.createAnyType())
      typeCheck(ctx, exp.body, type)
      return
    }

    case "BeginSugar": {
      typeCheck(ctx, L.desugarBegin(exp.sequence), type)
      return
    }

    // | If
    // | When
    // | Unless
    // | Cond

    // case "Tael":

    case "Set": {
      assert(L.isSetType(type))
      for (const element of exp.elements) {
        typeCheck(ctx, element, L.setTypeElementType(type))
      }

      return
    }

    case "Hash": {
      assert(L.isHashType(type))
      for (const entry of exp.entries) {
        typeCheck(ctx, entry.key, L.hashTypeKeyType(type))
        typeCheck(ctx, entry.value, L.hashTypeValueType(type))
      }

      return
    }

    case "Quote": {

    }

    default: {
      L.typeSubtype([], L.typeInfer(ctx, exp), type)
      return
    }
  }
}
