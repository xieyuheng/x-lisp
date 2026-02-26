import * as L from "../index.ts"

export function typeCheck(
  mod: L.Mod,
  ctx: L.Ctx,
  exp: L.Exp,
  type: L.Value,
): L.CheckEffect {
  if (L.isPolymorphicType(type)) {
    type = L.polymorphicTypeUnfold(type)
  }

  if (L.isAnyType(type)) {
    if (L.expPreferInfer(exp)) {
      return typeCheckByInfer(mod, ctx, exp, type)
    } else {
      return L.okCheckEffect()
    }
  }

  switch (exp.kind) {
    case "Lambda": {
      if (!L.isArrowType(type)) {
        let message = `expecting arrow type`
        message += `\n  type: ${L.formatValue(type)}`
        return L.errorCheckEffect(exp, message)
      }

      return typeCheckLambda(
        mod,
        ctx,
        exp.parameters,
        exp.body,
        L.arrowTypeArgTypes(type),
        L.arrowTypeRetType(type),
      )
    }

    case "Let1": {
      return L.inferThenCheck(
        L.typeInfer(mod, ctx, exp.rhs),
        (inferredType) => {
          ctx = L.ctxPut(ctx, exp.name, inferredType)
          return typeCheck(mod, ctx, exp.body, type)
        },
      )
    }

    case "Begin1": {
      return L.sequenceCheckEffect([
        typeCheck(mod, ctx, exp.head, L.createAnyType()),
        typeCheck(mod, ctx, exp.body, type),
      ])
    }

    case "BeginSugar": {
      return typeCheck(mod, ctx, L.desugarBegin(exp.sequence), type)
    }

    case "If": {
      return L.sequenceCheckEffect([
        typeCheck(mod, ctx, exp.condition, L.createAtomType("bool")),
        typeCheck(mod, ctx, exp.consequent, type),
        typeCheck(mod, ctx, exp.alternative, type),
      ])
    }

    case "When": {
      return typeCheck(mod, ctx, L.desugarWhen(exp), type)
    }

    case "Unless": {
      return typeCheck(mod, ctx, L.desugarUnless(exp), type)
    }

    case "Cond": {
      return typeCheck(mod, ctx, L.desugarCond(exp.condLines), type)
    }

    case "Tael": {
      if (L.isListType(type)) {
        const elementType = L.listTypeElementType(type)
        return L.sequenceCheckEffect([
          ...exp.elements.map((element) =>
            typeCheck(mod, ctx, element, elementType),
          ),
          ...Object.values(exp.attributes).map((value) =>
            typeCheck(mod, ctx, value, L.createAnyType()),
          ),
        ])
      } else if (L.isRecordType(type)) {
        const valueType = L.recordTypeValueType(type)
        return L.sequenceCheckEffect([
          ...exp.elements.map((element) =>
            typeCheck(mod, ctx, element, L.createAnyType()),
          ),
          ...Object.values(exp.attributes).map((value) =>
            typeCheck(mod, ctx, value, valueType),
          ),
        ])
      } else if (L.isDatatypeType(type)) {
        return typeCheck(mod, ctx, exp, L.datatypeTypeUnfold(type))
      } else if (L.isDisjointUnionType(type)) {
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
        const variantTypes = L.disjointUnionTypeVariantTypes(type)
        if (variantTypes[name] === undefined) {
          let message = `head hashtag mismatch`
          message += `\n  hashtag: ${L.formatExp(headExp)}`
          message += `\n  type: ${L.formatValue(type)}`
          return L.errorCheckEffect(exp, message)
        }

        return typeCheck(mod, ctx, exp, variantTypes[name])
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
          typeCheck(mod, ctx, element, L.setTypeElementType(type)),
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
          typeCheck(mod, ctx, entry.key, L.hashTypeKeyType(type)),
          typeCheck(mod, ctx, entry.value, L.hashTypeValueType(type)),
        ]),
      )
    }

    case "Quote": {
      return typeCheck(mod, ctx, L.desugarQuote(exp.sexp), type)
    }

    default: {
      return typeCheckByInfer(mod, ctx, exp, type)
    }
  }
}

export function typeCheckByInfer(
  mod: L.Mod,
  ctx: L.Ctx,
  exp: L.Exp,
  type: L.Value,
): L.CheckEffect {
  return (subst) => {
    const inferred = L.typeInfer(mod, ctx, exp)(subst)
    switch (inferred.kind) {
      case "InferOk": {
        const newSubst = L.typeUnify(subst, inferred.type, type)
        if (newSubst === undefined) {
          let message = `unificaton fail`
          message += `\n  inferred type: ${L.formatValue(inferred.type)}`
          message += `\n  expecting type: ${L.formatValue(type)}`
          return L.errorCheckEffect(exp, message)(subst)
        }

        const resolvedInferredType = L.substApplyToType(newSubst, inferred.type)
        const resolvedType = L.substApplyToType(newSubst, type)
        if (L.typeSubtype([], resolvedInferredType, resolvedType)) {
          return L.okCheckEffect()(newSubst)
        } else {
          let message = `inferred type is not a subtype of expecting type`
          message += `\n  inferred type: ${L.formatValue(resolvedInferredType)}`
          message += `\n  expecting type: ${L.formatValue(resolvedType)}`
          return L.errorCheckEffect(exp, message)(subst)
        }
      }

      case "InferError": {
        return {
          kind: "CheckError",
          exp: inferred.exp,
          message: inferred.message,
        }
      }
    }
  }
}

function typeCheckLambda(
  mod: L.Mod,
  ctx: L.Ctx,
  parameters: Array<string>,
  body: L.Exp,
  argTypes: Array<L.Value>,
  retType: L.Value,
): L.CheckEffect {
  if (argTypes.length === parameters.length) {
    ctx = L.ctxPutMany(ctx, parameters, argTypes)
    return typeCheck(mod, ctx, body, retType)
  } else if (argTypes.length > parameters.length) {
    ctx = L.ctxPutMany(ctx, parameters, argTypes.slice(0, parameters.length))
    return typeCheck(
      mod,
      ctx,
      body,
      L.createArrowType(argTypes.slice(parameters.length), retType),
    )
  } else {
    ctx = L.ctxPutMany(ctx, parameters.slice(0, argTypes.length), argTypes)
    return typeCheck(
      mod,
      ctx,
      L.Lambda(parameters.slice(argTypes.length), body),
      retType,
    )
  }
}
