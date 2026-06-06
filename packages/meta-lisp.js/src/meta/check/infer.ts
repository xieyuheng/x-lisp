import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function infer(mod: M.Mod, ctx: M.Ctx, exp: M.Term): M.InferEffect {
  return (subst) => {
    switch (exp.kind) {
      case "SymbolTerm": {
        const type = M.AtomType("symbol")
        return M.okInferEffect(type)(subst)
      }

      case "KeywordTerm": {
        const type = M.AtomType("keyword")
        return M.okInferEffect(type)(subst)
      }

      case "StringTerm": {
        const type = M.AtomType("string")
        return M.okInferEffect(type)(subst)
      }

      case "IntTerm": {
        const type = M.AtomType("int")
        return M.okInferEffect(type)(subst)
      }

      case "FloatTerm": {
        const type = M.AtomType("float")
        return M.okInferEffect(type)(subst)
      }

      case "VarTerm": {
        const type = M.ctxLookupType(ctx, exp.name)
        if (type) return M.okInferEffect(type)(subst)
        return inferLookup(mod, ctx, exp.name, exp)(subst)
      }

      case "QualifiedVarTerm": {
        const qualifiedMod = M.packageLookupMod(
          mod.pkg,
          exp.pkgName,
          exp.modName,
        )
        if (qualifiedMod === undefined) {
          let message = `undefined module prefix`
          message += `\n  package name: ${exp.pkgName}`
          message += `\n  package id: ${mod.pkg.id}`
          message += `\n  module name: ${exp.modName}`
          message += `\n  name: ${exp.name}`
          throw new S.ErrorWithSourceLocation(message, exp.location)
        }

        return inferLookup(qualifiedMod, ctx, exp.name, exp)(subst)
      }

      case "ApplyTerm": {
        return M.inferThenInfer(infer(mod, ctx, exp.target), (targetType) =>
          inferApplyArrowType(mod, ctx, targetType, exp.args, exp),
        )(subst)
      }

      case "LambdaTerm": {
        if (exp.parameters.length === 0) {
          const retType = M.createFreshVarType("R")
          const type = M.ArrowType([], retType)
          return M.checkThenInfer(
            M.checkByInfer(mod, ctx, exp.body, retType),
            M.okInferEffect(type),
          )(subst)
        } else if (exp.parameters.length === 1) {
          const argType = M.createFreshVarType("A")
          const retType = M.createFreshVarType("R")
          const type = M.ArrowType([argType], retType)
          const [parameter] = exp.parameters
          return M.checkThenInfer(
            M.checkByInfer(
              mod,
              M.ctxPut(ctx, parameter, argType),
              exp.body,
              retType,
            ),
            M.okInferEffect(type),
          )(subst)
        } else {
          const argType = M.createFreshVarType("A")
          const retType = M.createFreshVarType("R")
          const type = M.ArrowType([argType], retType)
          const [parameter, ...restParameters] = exp.parameters
          return M.checkThenInfer(
            M.checkByInfer(
              mod,
              M.ctxPut(ctx, parameter, argType),
              M.LambdaTerm(restParameters, exp.body, exp.location),
              retType,
            ),
            M.okInferEffect(type),
          )(subst)
        }
      }

      case "TheTerm": {
        const type = M.evaluateType(mod, M.emptyEnv("OpaqueMode"), exp.type)
        return M.checkThenInfer(
          M.checkAssignable(mod, ctx, exp.instance, type),
          M.okInferEffect(type),
        )(subst)
      }

      case "IfTerm": {
        const type = M.createFreshVarType("X")
        return M.checkThenInfer(
          M.sequenceCheckEffect([
            M.checkByInfer(mod, ctx, exp.condition, M.AtomType("bool")),
            M.checkByInfer(mod, ctx, exp.consequent, type),
            M.checkByInfer(mod, ctx, exp.alternative, type),
          ]),
          M.okInferEffect(type),
        )(subst)
      }

      case "Let1Term": {
        return M.inferThenInfer(
          M.infer(mod, ctx, exp.rhs),
          (inferredType) => (subst) => {
            ctx = M.substDeepWalkCtx(subst, ctx)
            inferredType = M.substDeepWalk(subst, inferredType)
            if (M.termIsSyntacticValue(exp.rhs)) {
              inferredType = M.generalizeInCtx(ctx, inferredType)
            }
            ctx = M.ctxPut(ctx, exp.name, inferredType)
            return infer(mod, ctx, exp.body)(subst)
          },
        )(subst)
      }

      case "Begin1Term": {
        return M.inferThenInfer(infer(mod, ctx, exp.head), (_headType) =>
          infer(mod, ctx, exp.body),
        )(subst)
      }

      case "ArrowTerm": {
        const type = M.TypeType()
        return M.checkThenInfer(
          M.sequenceCheckEffect([
            ...exp.argTypes.map((argType) =>
              M.checkByInfer(mod, ctx, argType, type),
            ),
            M.checkByInfer(mod, ctx, exp.retType, type),
          ]),
          M.okInferEffect(type),
        )(subst)
      }

      case "PolymorphicTerm": {
        const type = M.TypeType()
        ctx = M.ctxPutMany(
          ctx,
          exp.parameters,
          exp.parameters.map(() => type),
        )
        return M.checkThenInfer(
          M.checkByInfer(mod, ctx, exp.body, type),
          M.okInferEffect(type),
        )(subst)
      }
    }
  }
}

function inferLookup(
  mod: M.Mod,
  ctx: M.Ctx,
  name: string,
  exp: M.Term,
): M.InferEffect {
  return (subst) => {
    if (ctx.transparentOpaqueNames.has(name)) {
      const opaqueTypeExp = mod.opaqueClaimed.get(name)
      if (opaqueTypeExp) {
        const transparentType = M.evaluateType(
          mod,
          M.emptyEnv("TransparentMode"),
          opaqueTypeExp,
        )
        return M.okInferEffect(transparentType)(subst)
      }
    }

    const claimedType = M.modLookupClaimedType(mod, name)
    if (claimedType) return M.okInferEffect(claimedType)(subst)

    const definition = M.modLookupDefinition(mod, name)
    if (definition === undefined) {
      let message = `undefined variable`
      message += `\n  package id: ${mod.pkg.id}`
      message += `\n  module name: ${mod.name}`
      message += `\n  name: ${name}`
      return M.errorInferEffect(exp, message)(subst)
    }

    {
      // - when: inferLookup is called for B while checking A,
      //   and tryInferDefinitionBody has pre-allocated a fresh type
      //   variable for B, meaning B is in a mutual-recursive group with A.
      //   Return this fresh variable immediately to avoid infinite recursion.
      const inferredType = M.modLookupInferredType(mod, name)
      if (inferredType) return M.okInferEffect(inferredType)(subst)
    }

    // - when: B is defined later in the module, so it has no pre-allocated
    //   type variable and no inferred type yet.
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
      //   B's inferred type in mod.inferredTypes. Retrieve it.
      const inferredType = M.modLookupInferredType(mod, name)
      if (inferredType) return M.okInferEffect(inferredType)(subst)
    }

    let message = `[typeInferLookup] internal error: infer fail after check`
    message += `\n  module name: ${mod.name}`
    message += `\n  name: ${name}`
    throw new S.ErrorWithSourceLocation(message, exp.location)
  }
}

function inferApplyArrowType(
  mod: M.Mod,
  ctx: M.Ctx,
  type: M.Type,
  args: Array<M.Term>,
  originalExp: M.Term,
): M.InferEffect {
  return (subst) => {
    if (args.length === 0) {
      const retType = M.createFreshVarType("R")
      const arrowType = M.ArrowType([], retType)
      const newSubst = M.unify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = M.substDeepWalk(subst, type)
        let message = `expecting nullary arrow type`
        message += `\n  expected type: ${M.formatType(type)}`
        return M.errorInferEffect(originalExp, message)(subst)
      }

      return M.okInferEffect(retType)(newSubst)
    } else if (args.length === 1) {
      const argType = M.createFreshVarType("A")
      const retType = M.createFreshVarType("R")
      const arrowType = M.ArrowType([argType], retType)
      const newSubst = M.unify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = M.substDeepWalk(subst, type)
        let message = `expecting arrow type`
        message += `\n  expected type: ${M.formatType(type)}`
        message += `\n  args: ${M.formatTerms(args)}`
        return M.errorInferEffect(originalExp, message)(subst)
      }

      const [arg] = args
      return M.checkThenInfer(
        M.checkByInfer(mod, ctx, arg, argType),
        M.okInferEffect(retType),
      )(newSubst)
    } else {
      const argType = M.createFreshVarType("A")
      const retType = M.createFreshVarType("R")
      const arrowType = M.ArrowType([argType], retType)
      const newSubst = M.unify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = M.substDeepWalk(subst, type)
        let message = `expecting arrow type`
        message += `\n  expected type: ${M.formatType(type)}`
        message += `\n  args: ${M.formatTerms(args)}`
        return M.errorInferEffect(originalExp, message)(subst)
      }

      const [arg, ...restArgs] = args
      return M.checkThenInfer(
        M.checkByInfer(mod, ctx, arg, argType),
        inferApplyArrowType(mod, ctx, retType, restArgs, originalExp),
      )(newSubst)
    }
  }
}
