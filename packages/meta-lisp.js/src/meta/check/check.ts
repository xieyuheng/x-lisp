import * as C from "../../core/index.ts"
import * as M from "../index.ts"

export function checkAssignable(
  mod: M.Mod,
  ctx: M.Ctx,
  exp: M.Term,
  type: M.Type,
): M.Either<M.TypeError, C.Term> {
  const inferResult = M.infer(mod, ctx, exp)
  if (inferResult.kind === "Left") return inferResult
  const { type: inferredType, core } = inferResult.right

  // - need to use typeFreshen to remove polymorphic type
  //   before calling checkSubstInstance.
  const freshenedInferred = M.typeFreshen(inferredType)
  const freshenedType = M.typeFreshen(type)

  const substResult = checkSubstInstance(
    ctx,
    exp,
    freshenedInferred,
    freshenedType,
  )
  if (substResult.kind === "Left") return substResult

  const unifyResult = checkUnify(ctx, exp, freshenedInferred, freshenedType)
  if (M.isLeft(unifyResult)) return unifyResult

  return M.Right(core)
}

export function checkSubstInstance(
  ctx: M.Ctx,
  exp: M.Term,
  inferredType: M.Type,
  type: M.Type,
): M.Either<M.TypeError, void> {
  inferredType = M.substDeepWalk(M.ctxSubst(ctx), inferredType)
  type = M.substDeepWalk(M.ctxSubst(ctx), type)

  // - In the theory of polymorphic type,
  //   inferredType should be more general than expected type.
  if (!M.isSubstitutionInstance(type, inferredType)) {
    const prettyUnknownSubst = M.generatePrettyUnknownSubst([
      inferredType,
      type,
    ])

    inferredType = M.substDeepWalk(prettyUnknownSubst, inferredType)
    type = M.substDeepWalk(prettyUnknownSubst, type)

    const message =
      `expected type is not a substitution instance of inferred type` +
      `\n  inferred type: ${M.formatType(inferredType)}` +
      `\n  expected type: ${M.formatType(type)}`
    return M.Left({ term: exp, message })
  }

  return M.Right(undefined)
}

export function check(
  mod: M.Mod,
  ctx: M.Ctx,
  exp: M.Term,
  type: M.Type,
): M.Either<M.TypeError, C.Term> {
  const inferResult = M.infer(mod, ctx, exp)
  if (inferResult.kind === "Left") return inferResult
  const { type: inferredType, core } = inferResult.right

  const unifyResult = checkUnify(ctx, exp, inferredType, type)
  if (M.isLeft(unifyResult)) return unifyResult

  return M.Right(core)
}

export function checkUnify(
  ctx: M.Ctx,
  exp: M.Term,
  inferredType: M.Type,
  type: M.Type,
): M.Either<M.TypeError, void> {
  const newSubst = M.unify(M.ctxSubst(ctx), inferredType, type)
  if (newSubst === undefined) {
    inferredType = M.substDeepWalk(M.ctxSubst(ctx), inferredType)
    type = M.substDeepWalk(M.ctxSubst(ctx), type)

    const prettyUnknownSubst = M.generatePrettyUnknownSubst([
      inferredType,
      type,
    ])

    inferredType = M.substDeepWalk(prettyUnknownSubst, inferredType)
    type = M.substDeepWalk(prettyUnknownSubst, type)

    const message =
      `unification fail` +
      `\n  inferred type: ${M.formatType(inferredType)}` +
      `\n  expected type: ${M.formatType(type)}`
    return M.Left({ term: exp, message })
  }

  M.ctxPutSubst(ctx, newSubst)
  return M.Right(undefined)
}
