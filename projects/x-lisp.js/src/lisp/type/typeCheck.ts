import * as L from "../index.ts"

export function typeCheck(
  mod: L.Mod,
  ctx: L.Ctx,
  exp: L.Exp,
  type: L.Value,
): L.CheckEffect {
  return L.tryInferThenCheck(L.typeInfer(mod, ctx, exp), {
    onSuccess: (inferredType) =>
      typeCheckByInfer(mod, ctx, exp, inferredType, type),
    onFail: typeCheckWithoutInfer(mod, ctx, exp, type),
  })
}

function typeCheckWithoutInfer(
  mod: L.Mod,
  ctx: L.Ctx,
  exp: L.Exp,
  type: L.Value,
): L.CheckEffect {
  return (subst) => {
    if (L.isPolymorphicType(type)) {
      type = L.polymorphicTypeUnfold(type)
    }

    // if (L.isAnyType(type)) {
    //   if (L.expPreferInfer(exp)) {
    //     return L.inferThenCheck(L.typeInfer(mod, ctx, exp), (inferredType) =>
    //       typeCheckByInfer(mod, ctx, exp, inferredType, type),
    //     )(subst)
    //   } else {
    //     return L.okCheckEffect()(subst)
    //   }
    // }

    switch (exp.kind) {
      case "Lambda": {
        if (!L.isArrowType(type)) {
          let message = `expecting arrow type`
          message += `\n  type: ${L.formatType(type)}`
          return L.errorCheckEffect(exp, message)(subst)
        }

        return typeCheckLambda(
          mod,
          ctx,
          exp.parameters,
          exp.body,
          L.arrowTypeArgTypes(type),
          L.arrowTypeRetType(type),
        )(subst)
      }

      case "Let1": {
        return L.inferThenCheck(
          L.typeInfer(mod, ctx, exp.rhs),
          (inferredType) => {
            ctx = L.ctxPut(ctx, exp.name, inferredType)
            return typeCheck(mod, ctx, exp.body, type)
          },
        )(subst)
      }

      case "Begin1": {
        return L.sequenceCheckEffect([
          typeCheck(mod, ctx, exp.head, L.createAnyType()),
          typeCheck(mod, ctx, exp.body, type),
        ])(subst)
      }

      case "BeginSugar": {
        return typeCheck(mod, ctx, L.desugarBegin(exp.sequence), type)(subst)
      }

      case "If": {
        return L.sequenceCheckEffect([
          typeCheck(mod, ctx, exp.condition, L.createAtomType("bool")),
          typeCheck(mod, ctx, exp.consequent, type),
          typeCheck(mod, ctx, exp.alternative, type),
        ])(subst)
      }

      case "When": {
        return typeCheck(mod, ctx, L.desugarWhen(exp), type)(subst)
      }

      case "Unless": {
        return typeCheck(mod, ctx, L.desugarUnless(exp), type)(subst)
      }

      case "Cond": {
        return typeCheck(mod, ctx, L.desugarCond(exp.condLines), type)(subst)
      }

      case "Tuple": {
        if (L.isDatatypeType(type)) {
          return typeCheck(mod, ctx, exp, L.datatypeTypeUnfold(type))(subst)
        } else if (L.isDisjointUnionType(type)) {
          if (exp.elements.length === 0) {
            let message = `elements should not be empty`
            message += `\n  type: ${L.formatType(type)}`
            return L.errorCheckEffect(exp, message)(subst)
          }

          const headExp = exp.elements[0]
          if (headExp.kind !== "Keyword") {
            let message = `head of tuple should be Keyword`
            message += `\n  head: ${L.formatExp(headExp)}`
            message += `\n  type: ${L.formatType(type)}`
            return L.errorCheckEffect(exp, message)(subst)
          }

          const name = headExp.content
          const variantTypes = L.disjointUnionTypeVariantTypes(type)
          if (variantTypes[name] === undefined) {
            let message = `head keyword mismatch`
            message += `\n  keyword: ${L.formatExp(headExp)}`
            message += `\n  type: ${L.formatType(type)}`
            return L.errorCheckEffect(exp, message)(subst)
          }

          return typeCheck(mod, ctx, exp, variantTypes[name])(subst)
        } else {
          let message = `expecting tuple-like type`
          message += `\n  type: ${L.formatType(type)}`
          return L.errorCheckEffect(exp, message)(subst)
        }
      }

      case "List": {
        const listType = L.createListType(L.createFreshVarType("E"))
        const newSubst = L.typeUnify(subst, type, listType)
        if (newSubst === undefined) {
          type = L.substApplyToType(subst, type)
          let message = `expecting list type`
          message += `\n  type: ${L.formatType(type)}`
          return L.errorCheckEffect(exp, message)(subst)
        }

        subst = newSubst
        type = L.substApplyToType(subst, listType)

        const elementType = L.listTypeElementType(type)
        return L.sequenceCheckEffect([
          ...exp.elements.map((element) =>
            typeCheck(mod, ctx, element, elementType),
          ),
        ])(subst)
      }

      case "Set": {
        const setType = L.createSetType(L.createFreshVarType("E"))
        const newSubst = L.typeUnify(subst, type, setType)
        if (newSubst === undefined) {
          type = L.substApplyToType(subst, type)
          let message = `expecting set type`
          message += `\n  type: ${L.formatType(type)}`
          return L.errorCheckEffect(exp, message)(subst)
        }

        subst = newSubst
        type = L.substApplyToType(subst, setType)

        return L.sequenceCheckEffect(
          exp.elements.map((element) =>
            typeCheck(mod, ctx, element, L.setTypeElementType(type)),
          ),
        )(subst)
      }

      case "Hash": {
        const hashType = L.createHashType(
          L.createFreshVarType("K"),
          L.createFreshVarType("V"),
        )
        const newSubst = L.typeUnify(subst, type, hashType)
        if (newSubst === undefined) {
          type = L.substApplyToType(subst, type)
          let message = `expecting hash type`
          message += `\n  type: ${L.formatType(type)}`
          return L.errorCheckEffect(exp, message)(subst)
        }

        subst = newSubst
        type = L.substApplyToType(subst, hashType)

        return L.sequenceCheckEffect(
          exp.entries.flatMap((entry) => [
            typeCheck(mod, ctx, entry.key, L.hashTypeKeyType(type)),
            typeCheck(mod, ctx, entry.value, L.hashTypeValueType(type)),
          ]),
        )(subst)
      }

      case "Quote": {
        return typeCheck(mod, ctx, L.desugarQuote(exp.sexp), type)(subst)
      }

      default: {
        return L.inferThenCheck(L.typeInfer(mod, ctx, exp), (inferredType) =>
          typeCheckByInfer(mod, ctx, exp, inferredType, type),
        )(subst)
      }
    }
  }
}

export function typeCheckByInfer(
  mod: L.Mod,
  ctx: L.Ctx,
  exp: L.Exp,
  inferredType: L.Value,
  type: L.Value,
): L.CheckEffect {
  return (subst) => {
    if (L.isPolymorphicType(inferredType)) {
      inferredType = L.polymorphicTypeUnfold(inferredType)
    }

    const newSubst = L.typeUnify(subst, inferredType, type)
    if (newSubst === undefined) {
      inferredType = L.substApplyToType(subst, inferredType)
      type = L.substApplyToType(subst, type)

      let message = `unificaton fail`
      message += `\n  inferred type: ${L.formatType(inferredType)}`
      message += `\n  given type: ${L.formatType(type)}`
      return L.errorCheckEffect(exp, message)(subst)
    }

    const resolvedInferredType = L.substApplyToType(newSubst, inferredType)
    const resolvedType = L.substApplyToType(newSubst, type)

    if (L.typeSubtype([], resolvedInferredType, resolvedType)) {
      return L.okCheckEffect()(newSubst)
    } else {
      let message = `inferred type is not a subtype of given type`
      message += `\n  inferred type: ${L.formatType(resolvedInferredType)}`
      message += `\n  given type: ${L.formatType(resolvedType)}`
      return L.errorCheckEffect(exp, message)(newSubst)
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
