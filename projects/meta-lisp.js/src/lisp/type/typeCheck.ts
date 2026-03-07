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
