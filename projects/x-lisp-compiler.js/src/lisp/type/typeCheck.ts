import assert from "node:assert"
import * as L from "../index.ts"
import { unfoldDatatypeValue } from "./unfoldDatatypeValue.ts"


type CheckResult = { kind: "Ok" } | { kind: "Error", message: string }

export function typeCheck(ctx: L.Ctx, exp: L.Exp, type: L.Value): void {
  switch (exp.kind) {
    case "Lambda": {
      assert(L.isArrowType(type))
      typeCheckLambda(
        ctx,
        exp.parameters,
        exp.body,
        L.arrowTypeArgTypes(type),
        L.arrowTypeRetType(type),
      )
      return
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

    case "Tael": {
      if (L.isListType(type)) {
        const elementType = L.listTypeElementType(type)
        for (const element of exp.elements) {
          typeCheck(ctx, element, elementType)
        }

        for (const value of Object.values(exp.attributes)) {
          typeCheck(ctx, value, L.createAnyType())
        }

        return
      } else if (L.isRecordType(type)) {
        const valueType = L.recordTypeValueType(type)
        for (const element of exp.elements) {
          typeCheck(ctx, element, L.createAnyType())
        }

        for (const value of Object.values(exp.attributes)) {
          typeCheck(ctx, value, valueType)
        }

        return
      } else if (type.kind === "DatatypeValue") {
        typeCheck(ctx, exp, unfoldDatatypeValue(type))
        return
      } else if (type.kind === "DisjointUnionValue") {
        assert(exp.elements.length > 0)
        const headExp = exp.elements[0]
        assert(headExp.kind === "Hashtag")
        const name = headExp.content
        assert(type.types[name])
        typeCheck(ctx, exp, type.types[name])
        return
      } else {
        assert(false)
      }
    }

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
      typeCheck(ctx, L.desugarQuote(exp.sexp), type)
      return
    }

    default: {
      if (L.typeSubtype([], L.typeInfer(ctx, exp), type)) {
        return
      } else {
        assert(false)
      }
    }
  }
}

function typeCheckLambda(
  ctx: L.Ctx,
  parameters: Array<string>,
  body: L.Exp,
  argTypes: Array<L.Value>,
  retType: L.Value,
): void {
  if (argTypes.length === parameters.length) {
    ctx = L.ctxPutMany(ctx, parameters, argTypes)
    typeCheck(ctx, body, retType)
    return
  } else if (argTypes.length > parameters.length) {
    ctx = L.ctxPutMany(ctx, parameters, argTypes.slice(0, parameters.length))
    typeCheck(
      ctx,
      body,
      L.createArrowType(argTypes.slice(parameters.length), retType),
    )
    return
  } else {
    ctx = L.ctxPutMany(ctx, parameters.slice(0, argTypes.length), argTypes)
    typeCheck(ctx, L.Lambda(parameters.slice(argTypes.length), body), retType)
    return
  }
}
