import * as L from "../index.ts"

export function typeCheck(
  mod: L.Mod,
  ctx: L.Ctx,
  exp: L.Exp,
  type: L.Value,
): L.CheckEffect {
  return L.inferThenCheck(L.typeInfer(mod, ctx, exp), (inferredType) =>
    typeCheckByInfer(mod, ctx, exp, inferredType, type),
  )
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
