import assert from "node:assert"
import * as L from "../index.ts"

export function typeCheck(ctx: L.Ctx, exp: L.Exp, type: L.Value): void {
  switch (exp.kind) {
    case "Lambda": {
      assert(L.isArrowType(type))
      const argTypes = L.arrowTypeArgTypes(type)
      const retType = L.arrowTypeRetType(type)
      if (argTypes.length === exp.parameters.length) {
        ctx = L.ctxPutMany(ctx, exp.parameters, argTypes)
        typeCheck(ctx, exp.body, retType)
        return
      } else if (argTypes.length > exp.parameters.length) {
        ctx = L.ctxPutMany(
          ctx,
          exp.parameters,
          argTypes.slice(0, exp.parameters.length),
        )
        typeCheck(
          ctx,
          exp.body,
          L.createArrowType(argTypes.slice(exp.parameters.length), retType),
        )
        return
      } else {
        ctx = L.ctxPutMany(
          ctx,
          exp.parameters.slice(0, argTypes.length),
          argTypes,
        )
        typeCheck(
          ctx,
          L.Lambda(exp.parameters.slice(argTypes.length), exp.body),
          retType,
        )
        return
      }
    }

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

    case "If": {
      typeCheck(ctx, exp.condition, L.createAtomType("bool"))
      typeCheck(ctx, exp.consequent, type)
      typeCheck(ctx, exp.alternative, type)
      return
    }

    case "When": {
      typeCheck(ctx, L.desugarWhen(exp), type)
      return
    }

    case "Unless": {
      typeCheck(ctx, L.desugarUnless(exp), type)
      return
    }

    case "Cond": {
      typeCheck(ctx, L.desugarCond(exp.condLines), type)
      return
    }

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

    // case "Quote": {

    // }

    default: {
      L.typeSubtype([], L.typeInfer(ctx, exp), type)
      return
    }
  }
}
