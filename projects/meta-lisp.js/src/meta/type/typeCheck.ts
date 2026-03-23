import * as M from "../index.ts"

export function typeCheckAssignable(
  mod: M.Mod,
  ctx: M.Ctx,
  exp: M.Exp,
  type: M.Value,
): M.CheckEffect {
  return M.inferThenCheck(M.typeInfer(mod, ctx, exp), (inferredType) => {
    inferredType = M.typeFreshen(inferredType)
    type = M.typeFreshen(type)

    return M.sequenceCheckEffect([
      typeCheckSubstInstance(mod, exp, inferredType, type),
      typeCheckUnify(mod, exp, inferredType, type),
      typeCheckSubtype(mod, exp, inferredType, type),
    ])
  })
}

export function typeCheckSubstInstance(
  mod: M.Mod,
  exp: M.Exp,
  inferredType: M.Value,
  type: M.Value,
): M.CheckEffect {
  return (subst) => {
    inferredType = M.substApplyToType(subst, inferredType)
    type = M.substApplyToType(subst, type)
    // - In the theory of polymorphic type,
    //   inferredType should be more general than given type.
    if (!M.typeSubstInstance(type, inferredType)) {
      const prettyUnknownSubst = M.generatePrettyUnknownSubst([
        inferredType,
        type,
      ])

      inferredType = M.substApplyToType(prettyUnknownSubst, inferredType)
      type = M.substApplyToType(prettyUnknownSubst, type)

      let message = `given type is not a substitution instance of inferred type`
      message += `\n  inferred type: ${M.formatTypeInMod(mod, inferredType)}`
      message += `\n  given type: ${M.formatTypeInMod(mod, type)}`
      return M.errorCheckEffect(exp, message)(subst)
    }

    return M.okCheckEffect()(subst)
  }
}

export function typeCheckByInfer(
  mod: M.Mod,
  ctx: M.Ctx,
  exp: M.Exp,
  type: M.Value,
): M.CheckEffect {
  return M.inferThenCheck(M.typeInfer(mod, ctx, exp), (inferredType) => {
    inferredType = M.typeFreshen(inferredType)
    type = M.typeFreshen(type)

    return M.sequenceCheckEffect([
      typeCheckUnify(mod, exp, inferredType, type),
      typeCheckSubtype(mod, exp, inferredType, type),
    ])
  })
}

export function typeCheckUnify(
  mod: M.Mod,
  exp: M.Exp,
  inferredType: M.Value,
  type: M.Value,
): M.CheckEffect {
  return (subst) => {
    const newSubst = M.typeUnify([], subst, inferredType, type)
    if (newSubst === undefined) {
      inferredType = M.substApplyToType(subst, inferredType)
      type = M.substApplyToType(subst, type)

      const prettyUnknownSubst = M.generatePrettyUnknownSubst([
        inferredType,
        type,
      ])

      inferredType = M.substApplyToType(prettyUnknownSubst, inferredType)
      type = M.substApplyToType(prettyUnknownSubst, type)

      let message = `unification fail`
      message += `\n  inferred type: ${M.formatTypeInMod(mod, inferredType)}`
      message += `\n  given type: ${M.formatTypeInMod(mod, type)}`
      return M.errorCheckEffect(exp, message)(subst)
    }

    return M.okCheckEffect()(newSubst)
  }
}

export function typeCheckSubtype(
  mod: M.Mod,
  exp: M.Exp,
  inferredType: M.Value,
  type: M.Value,
): M.CheckEffect {
  return (subst) => {
    inferredType = M.substApplyToType(subst, inferredType)
    type = M.substApplyToType(subst, type)

    if (!M.typeSubtype([], inferredType, type)) {
      const prettyUnknownSubst = M.generatePrettyUnknownSubst([
        inferredType,
        type,
      ])

      inferredType = M.substApplyToType(prettyUnknownSubst, inferredType)
      type = M.substApplyToType(prettyUnknownSubst, type)

      let message = `inferred type is not a subtype of given type`
      message += `\n  inferred type: ${M.formatTypeInMod(mod, inferredType)}`
      message += `\n  given type: ${M.formatTypeInMod(mod, type)}`
      return M.errorCheckEffect(exp, message)(subst)
    }

    return M.okCheckEffect()(subst)
  }
}
