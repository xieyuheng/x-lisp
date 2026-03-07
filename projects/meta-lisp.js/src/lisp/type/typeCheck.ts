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

    if (L.isPolymorphicType(type)) {
      type = L.polymorphicTypeUnfold(type)
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
