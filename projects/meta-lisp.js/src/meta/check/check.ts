import * as M from "../index.ts"

export function checkAssignable(
  mod: M.Mod,
  ctx: M.Ctx,
  exp: M.Term,
  type: M.Type,
): M.CheckEffect {
  return M.inferThenCheck(M.infer(mod, ctx, exp), (inferredType) => {
    // - need to use typeFreshen to remove polymorphic type
    //   before calling checkSubstInstance.
    inferredType = M.typeFreshen(inferredType)
    type = M.typeFreshen(type)
    return M.sequenceCheckEffect([
      checkSubstInstance(mod, exp, inferredType, type),
      checkUnify(mod, exp, inferredType, type),
    ])
  })
}

export function checkSubstInstance(
  mod: M.Mod,
  exp: M.Term,
  inferredType: M.Type,
  type: M.Type,
): M.CheckEffect {
  return (subst) => {
    inferredType = M.substDeepWalk(subst, inferredType)
    type = M.substDeepWalk(subst, type)
    // - In the theory of polymorphic type,
    //   inferredType should be more general than expected type.
    if (!M.isSubstitutionInstance(type, inferredType)) {
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

export function checkByInfer(
  mod: M.Mod,
  ctx: M.Ctx,
  exp: M.Term,
  type: M.Type,
): M.CheckEffect {
  return M.inferThenCheck(M.infer(mod, ctx, exp), (inferredType) =>
    checkUnify(mod, exp, inferredType, type),
  )
}

export function checkUnify(
  mod: M.Mod,
  exp: M.Term,
  inferredType: M.Type,
  type: M.Type,
): M.CheckEffect {
  return (subst) => {
    const newSubst = M.unify(subst, inferredType, type)
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
