import * as L from "../index.ts"

export function typeCheckAssignable(
  mod: L.Mod,
  ctx: L.Ctx,
  exp: L.Exp,
  type: L.Value,
): L.CheckEffect {
  return L.inferThenCheck(L.typeInfer(mod, ctx, exp), (inferredType) => {
    inferredType = L.typeFreshen(inferredType)
    type = L.typeFreshen(type)

    return L.sequenceCheckEffect([
      typeCheckSubstInstance(mod, exp, inferredType, type),
      typeCheckUnify(mod, exp, inferredType, type),
      typeCheckSubtype(mod, exp, inferredType, type),
    ])
  })
}

export function typeCheckSubstInstance(
  mod: L.Mod,
  exp: L.Exp,
  inferredType: L.Value,
  type: L.Value,
): L.CheckEffect {
  return (subst) => {
    inferredType = L.substApplyToType(subst, inferredType)
    type = L.substApplyToType(subst, type)
    // - In the theory of polymorphic type,
    //   inferredType should be more general than given type.
    if (!L.typeSubstInstance(type, inferredType)) {
      const prettyUnknownSubst = L.generatePrettyUnknownSubst([
        inferredType,
        type,
      ])

      inferredType = L.substApplyToType(prettyUnknownSubst, inferredType)
      type = L.substApplyToType(prettyUnknownSubst, type)

      let message = `given type is not a substitution instance of inferred type`
      message += `\n  inferred type: ${L.formatTypeInMod(mod, inferredType)}`
      message += `\n  given type: ${L.formatTypeInMod(mod, type)}`
      return L.errorCheckEffect(exp, message)(subst)
    }

    return L.okCheckEffect()(subst)
  }
}

export function typeCheckByInfer(
  mod: L.Mod,
  ctx: L.Ctx,
  exp: L.Exp,
  type: L.Value,
): L.CheckEffect {
  return L.inferThenCheck(L.typeInfer(mod, ctx, exp), (inferredType) => {
    inferredType = L.typeFreshen(inferredType)
    type = L.typeFreshen(type)

    return L.sequenceCheckEffect([
      typeCheckUnify(mod, exp, inferredType, type),
      typeCheckSubtype(mod, exp, inferredType, type),
    ])
  })
}

export function typeCheckUnify(
  mod: L.Mod,
  exp: L.Exp,
  inferredType: L.Value,
  type: L.Value,
): L.CheckEffect {
  return (subst) => {
    const newSubst = L.typeUnify([], subst, inferredType, type)
    if (newSubst === undefined) {
      inferredType = L.substApplyToType(subst, inferredType)
      type = L.substApplyToType(subst, type)

      const prettyUnknownSubst = L.generatePrettyUnknownSubst([
        inferredType,
        type,
      ])

      inferredType = L.substApplyToType(prettyUnknownSubst, inferredType)
      type = L.substApplyToType(prettyUnknownSubst, type)

      let message = `unification fail`
      message += `\n  inferred type: ${L.formatTypeInMod(mod, inferredType)}`
      message += `\n  given type: ${L.formatTypeInMod(mod, type)}`
      return L.errorCheckEffect(exp, message)(subst)
    }

    return L.okCheckEffect()(newSubst)
  }
}

export function typeCheckSubtype(
  mod: L.Mod,
  exp: L.Exp,
  inferredType: L.Value,
  type: L.Value,
): L.CheckEffect {
  return (subst) => {
    inferredType = L.substApplyToType(subst, inferredType)
    type = L.substApplyToType(subst, type)

    if (!L.typeSubtype([], inferredType, type)) {
      const prettyUnknownSubst = L.generatePrettyUnknownSubst([
        inferredType,
        type,
      ])

      inferredType = L.substApplyToType(prettyUnknownSubst, inferredType)
      type = L.substApplyToType(prettyUnknownSubst, type)

      let message = `inferred type is not a subtype of given type`
      message += `\n  inferred type: ${L.formatTypeInMod(mod, inferredType)}`
      message += `\n  given type: ${L.formatTypeInMod(mod, type)}`
      return L.errorCheckEffect(exp, message)(subst)
    }

    return L.okCheckEffect()(subst)
  }
}
