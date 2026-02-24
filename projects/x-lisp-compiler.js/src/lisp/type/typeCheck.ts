import * as L from "../index.ts"
import { unfoldDatatypeValue } from "./unfoldDatatypeValue.ts"

export function typeCheck(
  ctx: L.Ctx,
  exp: L.Exp,
  type: L.Value,
): L.CheckEffect {
  switch (exp.kind) {
    case "Lambda": {
      if (!L.isArrowType(type)) {
        let message = `expecting arrow type`
        message += `\n  type: ${L.formatValue(type)}`
        return L.errorCheckEffect(exp, message)
      }

      return typeCheckLambda(
        ctx,
        exp.parameters,
        exp.body,
        L.arrowTypeArgTypes(type),
        L.arrowTypeRetType(type),
      )
    }

    case "Let1": {
      ctx = L.ctxPut(ctx, exp.name, L.typeInfer(ctx, exp.rhs))
      return typeCheck(ctx, exp.body, type)
    }

    case "Begin1": {
      return L.sequenceCheckEffect([
        typeCheck(ctx, exp.head, L.createAnyType()),
        typeCheck(ctx, exp.body, type),
      ])
    }

    case "BeginSugar": {
      return typeCheck(ctx, L.desugarBegin(exp.sequence), type)
    }

    case "If": {
      return L.sequenceCheckEffect([
        typeCheck(ctx, exp.condition, L.createAtomType("bool")),
        typeCheck(ctx, exp.consequent, type),
        typeCheck(ctx, exp.alternative, type),
      ])
    }

    case "When": {
      return typeCheck(ctx, L.desugarWhen(exp), type)
    }

    case "Unless": {
      return typeCheck(ctx, L.desugarUnless(exp), type)
    }

    case "Cond": {
      return typeCheck(ctx, L.desugarCond(exp.condLines), type)
    }

    case "Tael": {
      if (L.isListType(type)) {
        const elementType = L.listTypeElementType(type)
        return L.sequenceCheckEffect([
          ...exp.elements.map((element) =>
            typeCheck(ctx, element, elementType),
          ),
          ...Object.values(exp.attributes).map((value) =>
            typeCheck(ctx, value, L.createAnyType()),
          ),
        ])
      } else if (L.isRecordType(type)) {
        const valueType = L.recordTypeValueType(type)
        return L.sequenceCheckEffect([
          ...exp.elements.map((element) =>
            typeCheck(ctx, element, L.createAnyType()),
          ),
          ...Object.values(exp.attributes).map((value) =>
            typeCheck(ctx, value, valueType),
          ),
        ])
      } else if (type.kind === "DatatypeValue") {
        return typeCheck(ctx, exp, unfoldDatatypeValue(type))
      } else if (type.kind === "DisjointUnionValue") {
        if (exp.elements.length === 0) {
          let message = `elements should not be empty`
          message += `\n  type: ${L.formatValue(type)}`
          return L.errorCheckEffect(exp, message)
        }

        const headExp = exp.elements[0]
        if (headExp.kind !== "Hashtag") {
          let message = `head of tael should be Hashtag`
          message += `\n  head: ${L.formatExp(headExp)}`
          message += `\n  type: ${L.formatValue(type)}`
          return L.errorCheckEffect(exp, message)
        }

        const name = headExp.content
        if (type.types[name] === undefined) {
          let message = `head hashtag mismatch`
          message += `\n  hashtag: ${L.formatExp(headExp)}`
          message += `\n  type: ${L.formatValue(type)}`
          return L.errorCheckEffect(exp, message)
        }

        return typeCheck(ctx, exp, type.types[name])
      } else {
        let message = `expecting tael-like type`
        message += `\n  type: ${L.formatValue(type)}`
        return L.errorCheckEffect(exp, message)
      }
    }

    case "Set": {
      if (!L.isSetType(type)) {
        let message = `expecting set type`
        message += `\n  type: ${L.formatValue(type)}`
        return L.errorCheckEffect(exp, message)
      }

      return L.sequenceCheckEffect(
        exp.elements.map((element) =>
          typeCheck(ctx, element, L.setTypeElementType(type)),
        ),
      )
    }

    case "Hash": {
      if (!L.isHashType(type)) {
        let message = `expecting hash type`
        message += `\n  type: ${L.formatValue(type)}`
        return L.errorCheckEffect(exp, message)
      }

      return L.sequenceCheckEffect(
        exp.entries.flatMap((entry) => [
          typeCheck(ctx, entry.key, L.hashTypeKeyType(type)),
          typeCheck(ctx, entry.value, L.hashTypeValueType(type)),
        ]),
      )
    }

    case "Quote": {
      return typeCheck(ctx, L.desugarQuote(exp.sexp), type)
    }

    default: {
      const inferredType = L.typeInfer(ctx, exp)
      if (L.typeSubtype([], inferredType, type)) {
        return L.okCheckEffect()
      } else {
        let message = `inferred type is not a subtype of given type`
        message += `\n  inferred type: ${L.formatValue(inferredType)}`
        message += `\n  given type: ${L.formatValue(type)}`
        return L.errorCheckEffect(exp, message)
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
): L.CheckEffect {
  if (argTypes.length === parameters.length) {
    ctx = L.ctxPutMany(ctx, parameters, argTypes)
    return typeCheck(ctx, body, retType)
  } else if (argTypes.length > parameters.length) {
    ctx = L.ctxPutMany(ctx, parameters, argTypes.slice(0, parameters.length))
    return typeCheck(
      ctx,
      body,
      L.createArrowType(argTypes.slice(parameters.length), retType),
    )
  } else {
    ctx = L.ctxPutMany(ctx, parameters.slice(0, argTypes.length), argTypes)
    return typeCheck(
      ctx,
      L.Lambda(parameters.slice(argTypes.length), body),
      retType,
    )
  }
}
