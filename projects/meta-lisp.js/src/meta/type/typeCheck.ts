import * as M from "../index.ts"

export function typeCheckAssignable(
  mod: M.Mod,
  ctx: M.Ctx,
  exp: M.Exp,
  type: M.Type,
): M.CheckEffect {
  return M.inferThenCheck(M.typeInfer(mod, ctx, exp), (inferredType) => {
    inferredType = M.typeFreshen(inferredType)
    type = M.typeFreshen(type)
    return M.sequenceCheckEffect([
      typeCheckSubstInstance(mod, exp, inferredType, type),
      typeCheckUnify(mod, exp, inferredType, type),
    ])
  })
}

export function typeCheckSubstInstance(
  mod: M.Mod,
  exp: M.Exp,
  inferredType: M.Type,
  type: M.Type,
): M.CheckEffect {
  return (subst) => {
    inferredType = M.substDeepWalk(subst, inferredType)
    type = M.substDeepWalk(subst, type)
    if (!M.typeSubstInstance(type, inferredType)) {
      const prettyUnknownSubst = M.generatePrettyUnknownSubst([
        inferredType,
        type,
      ])

      inferredType = M.substDeepWalk(prettyUnknownSubst, inferredType)
      type = M.substDeepWalk(prettyUnknownSubst, type)

      let message = `expected type is not a substitution instance of inferred type`
      message += `\n  inferred type: ${M.formatType(inferredType)}`
      message += `\n  expected type: ${M.formatType(type)}`
      return M.errorCheckEffect(exp, message)(subst)
    }

    return M.okCheckEffect()(subst)
  }
}

export function typeCheckByInfer(
  mod: M.Mod,
  ctx: M.Ctx,
  exp: M.Exp,
  type: M.Type,
): M.CheckEffect {
  return M.inferThenCheck(M.typeInfer(mod, ctx, exp), (inferredType) =>
    typeCheckUnify(mod, exp, inferredType, type),
  )
}

export function typeCheckUnify(
  mod: M.Mod,
  exp: M.Exp,
  inferredType: M.Type,
  type: M.Type,
): M.CheckEffect {
  return (subst) => {
    const newSubst = M.typeUnify(subst, inferredType, type)
    if (newSubst === undefined) {
      inferredType = M.substDeepWalk(subst, inferredType)
      type = M.substDeepWalk(subst, type)

      const prettyUnknownSubst = M.generatePrettyUnknownSubst([
        inferredType,
        type,
      ])

      inferredType = M.substDeepWalk(prettyUnknownSubst, inferredType)
      type = M.substDeepWalk(prettyUnknownSubst, type)

      let message = `unification fail`
      message += `\n  inferred type: ${M.formatType(inferredType)}`
      message += `\n  expected type: ${M.formatType(type)}`
      return M.errorCheckEffect(exp, message)(subst)
    }

    return M.okCheckEffect()(newSubst)
  }
}
