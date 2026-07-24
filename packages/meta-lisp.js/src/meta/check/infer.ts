import * as S from "@xieyuheng/sexp.js"
import * as Pkg from "../../package/index.ts"
import * as M from "../index.ts"

export type TypeError = { term: M.Term; message: string }

export type Inferred = { core: M.Term; type: M.Type }

export function Inferred(core: M.Term, type: M.Type): Inferred {
  return { core, type }
}

export function infer(
  mod: M.Mod,
  ctx: M.Ctx,
  exp: M.Term,
): M.Either<TypeError, Inferred> {
  switch (exp.kind) {
    case "SymbolTerm": {
      return M.Right(
        M.Inferred(
          M.SymbolTerm(exp.content, exp.location),
          M.AtomType("symbol"),
        ),
      )
    }

    case "KeywordTerm": {
      return M.Right(
        M.Inferred(
          M.KeywordTerm(exp.content, exp.location),
          M.AtomType("keyword"),
        ),
      )
    }

    case "StringTerm": {
      return M.Right(
        M.Inferred(
          M.StringTerm(exp.content, exp.location),
          M.AtomType("string"),
        ),
      )
    }

    case "IntTerm": {
      return M.Right(
        M.Inferred(M.IntTerm(exp.content, exp.location), M.AtomType("int")),
      )
    }

    case "FloatTerm": {
      return M.Right(
        M.Inferred(M.FloatTerm(exp.content, exp.location), M.AtomType("float")),
      )
    }

    case "VarTerm": {
      const type = M.ctxLookupType(ctx, exp.name)
      if (type) {
        return M.Right(M.Inferred(exp, type))
      }
      return inferLookup(mod, ctx, exp.name, exp)
    }

    case "QualifiedVarTerm": {
      const qualifiedMod = Pkg.packageLookupMod(
        mod.pkg,
        exp.pkgName,
        exp.modName,
      )
      if (qualifiedMod === undefined) {
        let message = `undefined module prefix`
        message += `\n  from package: ${mod.pkg.rootDirectory}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      return inferLookup(qualifiedMod, ctx, exp.name, exp)
    }

    case "ApplyTerm": {
      const targetResult = M.infer(mod, ctx, exp.target)
      if (M.isLeft(targetResult)) return targetResult
      const { type: targetType, core: targetCore } = targetResult.right
      return inferApplyArrowType(
        mod,
        ctx,
        targetType,
        targetCore,
        exp.args,
        exp,
      )
    }

    case "LambdaTerm": {
      if (exp.parameters.length === 0) {
        const retType = M.createFreshVarType("R")
        const type = M.ArrowType([], retType)
        const bodyResult = M.checkByInfer(mod, ctx, exp.body, retType)
        if (M.isLeft(bodyResult)) return bodyResult
        return M.Right(
          M.Inferred(M.LambdaTerm([], bodyResult.right, exp.location), type),
        )
      } else if (exp.parameters.length === 1) {
        const argType = M.createFreshVarType("A")
        const retType = M.createFreshVarType("R")
        const type = M.ArrowType([argType], retType)
        const [parameter] = exp.parameters
        const bodyResult = M.checkByInfer(
          mod,
          M.ctxPut(ctx, parameter, argType),
          exp.body,
          retType,
        )
        if (M.isLeft(bodyResult)) return bodyResult
        return M.Right(
          M.Inferred(
            M.LambdaTerm([parameter], bodyResult.right, exp.location),
            type,
          ),
        )
      } else {
        const argType = M.createFreshVarType("A")
        const retType = M.createFreshVarType("R")
        const type = M.ArrowType([argType], retType)
        const [parameter, ...restParameters] = exp.parameters
        const bodyResult = M.checkByInfer(
          mod,
          M.ctxPut(ctx, parameter, argType),
          M.LambdaTerm(restParameters, exp.body, exp.location),
          retType,
        )
        if (M.isLeft(bodyResult)) return bodyResult
        return M.Right(
          M.Inferred(
            M.LambdaTerm([parameter], bodyResult.right, exp.location),
            type,
          ),
        )
      }
    }

    case "TheTerm": {
      const type = M.evaluateType(mod, M.emptyEnv("OpaqueMode"), exp.type)
      const checkResult = M.checkAssignable(mod, ctx, exp.instance, type)
      if (M.isLeft(checkResult)) return checkResult
      return M.Right(M.Inferred(checkResult.right, type))
    }

    case "IfTerm": {
      const type = M.createFreshVarType("X")
      const conditionResult = M.checkByInfer(
        mod,
        ctx,
        exp.condition,
        M.AtomType("bool"),
      )
      if (M.isLeft(conditionResult)) return conditionResult
      const consequentResult = M.checkByInfer(mod, ctx, exp.consequent, type)
      if (M.isLeft(consequentResult)) return consequentResult
      const alternativeResult = M.checkByInfer(mod, ctx, exp.alternative, type)
      if (M.isLeft(alternativeResult)) return alternativeResult
      return M.Right({
        type,
        core: M.IfTerm(
          conditionResult.right,
          consequentResult.right,
          alternativeResult.right,
          exp.location,
        ),
      })
    }

    case "Let1Term": {
      const rhsResult = M.infer(mod, ctx, exp.rhs)
      if (M.isLeft(rhsResult)) return rhsResult
      const { type: rhsType, core: rhsCore } = rhsResult.right
      if (M.termIsSyntacticValue(exp.rhs)) {
        ctx = M.substDeepWalkCtx(M.ctxSubst(ctx), ctx)
        let walkedType = M.substDeepWalk(M.ctxSubst(ctx), rhsType)
        walkedType = M.generalizeInCtx(ctx, walkedType)
        ctx = M.ctxPut(ctx, exp.name, walkedType)
        const bodyResult = M.infer(mod, ctx, exp.body)
        if (M.isLeft(bodyResult)) return bodyResult
        const { type: bodyType, core: bodyCore } = bodyResult.right
        return M.Right(
          M.Inferred(
            M.Let1Term(exp.name, rhsCore, bodyCore, exp.location),
            bodyType,
          ),
        )
      } else {
        ctx = M.ctxPut(ctx, exp.name, rhsType)
        const bodyResult = M.infer(mod, ctx, exp.body)
        if (M.isLeft(bodyResult)) return bodyResult
        const { type: bodyType, core: bodyCore } = bodyResult.right
        return M.Right(
          M.Inferred(
            M.Let1Term(exp.name, rhsCore, bodyCore, exp.location),
            bodyType,
          ),
        )
      }
    }

    case "Begin1Term": {
      const headResult = M.infer(mod, ctx, exp.head)
      if (M.isLeft(headResult)) return headResult
      const { core: headCore } = headResult.right
      const bodyResult = M.infer(mod, ctx, exp.body)
      if (M.isLeft(bodyResult)) return bodyResult
      const { type: bodyType, core: bodyCore } = bodyResult.right
      return M.Right(
        M.Inferred(M.Begin1Term(headCore, bodyCore, exp.location), bodyType),
      )
    }

    case "ArrowTerm": {
      const type = M.TypeType()
      for (const argType of exp.argTypes) {
        const result = M.checkByInfer(mod, ctx, argType, type)
        if (M.isLeft(result)) return result
      }
      const retResult = M.checkByInfer(mod, ctx, exp.retType, type)
      if (M.isLeft(retResult)) return retResult
      return M.Right(M.Inferred(retResult.right, type))
    }

    case "PolymorphicTerm": {
      const type = M.TypeType()
      ctx = M.ctxPutMany(
        ctx,
        exp.parameters,
        exp.parameters.map(() => type),
      )
      const bodyResult = M.checkByInfer(mod, ctx, exp.body, type)
      if (M.isLeft(bodyResult)) return bodyResult
      return M.Right(M.Inferred(bodyResult.right, type))
    }
  }
}

function inferLookup(
  mod: M.Mod,
  ctx: M.Ctx,
  name: string,
  exp: M.Term,
): M.Either<TypeError, Inferred> {
  if (ctx.transparentOpaqueNames.has(name)) {
    const claimedEntry = M.modLookupClaimedEntry(mod, name)
    if (claimedEntry) {
      const transparentType = M.evaluateType(
        mod,
        M.emptyEnv("TransparentMode"),
        claimedEntry.term,
      )
      return M.Right(M.Inferred(exp, transparentType))
    }
  }

  const claimedType = M.modLookupClaimedType(mod, name)
  if (claimedType) {
    return M.Right(M.Inferred(exp, claimedType))
  }

  const definition = M.modLookupDefinition(mod, name)
  if (definition === undefined) {
    let message = `undefined variable`
    message += `\n  package id: ${mod.pkg.id}`
    message += `\n  module name: ${mod.name}`
    message += `\n  name: ${name}`
    return M.Left({ term: exp, message })
  }

  {
    // - when: inferLookup is called for B while checking A,
    //   and tryInferDefinitionBody has pre-allocated a fresh type
    //   variable for B, meaning B is in a mutual-recursive group with A.
    //   Return this fresh variable immediately to avoid infinite recursion.
    const inferredType = M.modLookupInferredType(mod, name)
    if (inferredType) {
      return M.Right(M.Inferred(exp, inferredType))
    }
  }

  // - when: B is defined later in the module, so it has no pre-allocated
  //   type variable and no Inferred type yet.
  //   Check B on demand to obtain its type.
  //   This branch must come AFTER the mutual-recursion check above,
  //   otherwise checking a mutual-recursive group would loop infinitely.
  //
  // - We do NOT propagate the return value here,
  //   because the error message is already printed by definitionCheck,
  //   and outcome is tracked in DefinitionState for CheckPass.
  M.definitionCheck(definition)

  {
    // - when: after definitionCheck, tryInferDefinitionBody has stored
    //   B's Inferred type in mod.inferredTypes. Retrieve it.
    const inferredType = M.modLookupInferredType(mod, name)
    if (inferredType) {
      return M.Right(M.Inferred(exp, inferredType))
    }
  }

  let message = `[typeInferLookup] internal error: infer fail after check`
  message += `\n  module name: ${mod.name}`
  message += `\n  name: ${name}`
  throw new S.ErrorWithSourceLocation(message, exp.location)
}

function inferApplyArrowType(
  mod: M.Mod,
  ctx: M.Ctx,
  type: M.Type,
  targetCore: M.Term,
  args: Array<M.Term>,
  originalExp: M.Term,
): M.Either<TypeError, Inferred> {
  if (args.length === 0) {
    const retType = M.createFreshVarType("R")
    const arrowType = M.ArrowType([], retType)
    const newSubst = M.unify(M.ctxSubst(ctx), type, arrowType)
    if (newSubst === undefined) {
      type = M.substDeepWalk(M.ctxSubst(ctx), type)
      const message =
        `expecting nullary arrow type` +
        `\n  expected type: ${M.formatType(type)}`
      return M.Left({ term: originalExp, message })
    }
    M.ctxPutSubst(ctx, newSubst)
    return M.Right(
      M.Inferred(M.ApplyTerm(targetCore, [], originalExp.location), retType),
    )
  } else if (args.length === 1) {
    const argType = M.createFreshVarType("A")
    const retType = M.createFreshVarType("R")
    const arrowType = M.ArrowType([argType], retType)
    const newSubst = M.unify(M.ctxSubst(ctx), type, arrowType)
    if (newSubst === undefined) {
      type = M.substDeepWalk(M.ctxSubst(ctx), type)
      const message =
        `expecting arrow type` +
        `\n  expected type: ${M.formatType(type)}` +
        `\n  args: ${M.formatTerms(args)}`
      return M.Left({ term: originalExp, message })
    }
    M.ctxPutSubst(ctx, newSubst)
    const [arg] = args
    const argResult = M.checkByInfer(mod, ctx, arg, argType)
    if (M.isLeft(argResult)) return argResult
    return M.Right(
      M.Inferred(
        M.ApplyTerm(targetCore, [argResult.right], originalExp.location),
        retType,
      ),
    )
  }

  const argCores: Array<M.Term> = []
  let currentType = type

  for (const arg of args) {
    const argType = M.createFreshVarType("A")
    const retType = M.createFreshVarType("R")
    const arrowType = M.ArrowType([argType], retType)
    const newSubst = M.unify(M.ctxSubst(ctx), currentType, arrowType)
    if (newSubst === undefined) {
      currentType = M.substDeepWalk(M.ctxSubst(ctx), currentType)
      const message =
        `expecting arrow type` +
        `\n  expected type: ${M.formatType(currentType)}` +
        `\n  args: ${M.formatTerms(args)}`
      return M.Left({ term: originalExp, message })
    }
    M.ctxPutSubst(ctx, newSubst)
    const argResult = M.checkByInfer(mod, ctx, arg, argType)
    if (M.isLeft(argResult)) return argResult
    argCores.push(argResult.right)
    currentType = retType
  }

  return M.Right(
    M.Inferred(
      M.ApplyTerm(targetCore, argCores, originalExp.location),
      currentType,
    ),
  )
}
