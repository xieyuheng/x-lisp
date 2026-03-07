import assert from "node:assert"
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

    switch (exp.kind) {
      case "Lambda": {
        if (exp.parameters.length === 0) {
          const arrowType = L.createArrowType([], L.createFreshVarType("R"))
          const newSubst = L.typeUnify(subst, type, arrowType)
          if (newSubst === undefined) {
            type = L.substApplyToType(subst, type)
            let message = `expecting nullary arrow type`
            message += `\n  given type: ${L.formatType(type)}`
            return L.errorCheckEffect(exp, message)(subst)
          }

          subst = newSubst
          type = L.substApplyToType(subst, arrowType)

          type = L.arrowTypeNormalize(type)
          const argTypes = L.arrowTypeArgTypes(type)
          assert(argTypes.length === 0)
          const retType = L.arrowTypeRetType(type)
          return typeCheck(mod, ctx, exp.body, retType)(subst)
        } else if (exp.parameters.length === 1) {
          const arrowType = L.createArrowType(
            [L.createFreshVarType("A")],
            L.createFreshVarType("R"),
          )
          const newSubst = L.typeUnify(subst, type, arrowType)
          if (newSubst === undefined) {
            type = L.substApplyToType(subst, type)
            let message = `expecting arrow type`
            message += `\n  given type: ${L.formatType(type)}`
            return L.errorCheckEffect(exp, message)(subst)
          }

          subst = newSubst
          type = L.substApplyToType(subst, arrowType)

          type = L.arrowTypeNormalize(type)
          const [argType] = L.arrowTypeArgTypes(type)
          const retType = L.arrowTypeRetType(type)

          const [parameter] = exp.parameters
          ctx = L.ctxPut(ctx, parameter, argType)
          return typeCheck(mod, ctx, exp.body, retType)(subst)
        } else {
          const arrowType = L.createArrowType(
            [L.createFreshVarType("A")],
            L.createFreshVarType("R"),
          )
          const newSubst = L.typeUnify(subst, type, arrowType)
          if (newSubst === undefined) {
            type = L.substApplyToType(subst, type)
            let message = `expecting arrow type`
            message += `\n  given type: ${L.formatType(type)}`
            return L.errorCheckEffect(exp, message)(subst)
          }

          subst = newSubst
          type = L.substApplyToType(subst, arrowType)

          type = L.arrowTypeNormalize(type)
          const [argType] = L.arrowTypeArgTypes(type)
          const retType = L.arrowTypeRetType(type)

          const [parameter, ...restParameters] = exp.parameters
          ctx = L.ctxPut(ctx, parameter, argType)
          return typeCheck(
            mod,
            ctx,
            L.Lambda(restParameters, exp.body, exp.meta),
            retType,
          )(subst)
        }
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
        return L.inferThenCheck(L.typeInfer(mod, ctx, exp.head), (_headType) =>
          typeCheck(mod, ctx, exp.body, type),
        )(subst)
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
        // TODO

        let message = `expecting tau type`
        message += `\n  given type: ${L.formatType(type)}`
        return L.errorCheckEffect(exp, message)(subst)
      }

      case "Object": {
        // TODO

        let message = `expecting class type`
        message += `\n  given type: ${L.formatType(type)}`
        return L.errorCheckEffect(exp, message)(subst)
      }

      case "List": {
        const listType = L.createListType(L.createFreshVarType("E"))
        const newSubst = L.typeUnify(subst, type, listType)
        if (newSubst === undefined) {
          type = L.substApplyToType(subst, type)
          let message = `expecting list type`
          message += `\n  given type: ${L.formatType(type)}`
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
          message += `\n  given type: ${L.formatType(type)}`
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
          message += `\n  given type: ${L.formatType(type)}`
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

    subst = newSubst
    inferredType = L.substApplyToType(subst, inferredType)
    type = L.substApplyToType(subst, type)

    if (L.typeSubtype([], inferredType, type)) {
      return L.okCheckEffect()(subst)
    } else {
      let message = `inferred type is not a subtype of given type`
      message += `\n  inferred type: ${L.formatType(inferredType)}`
      message += `\n  given type: ${L.formatType(type)}`
      return L.errorCheckEffect(exp, message)(subst)
    }
  }
}
