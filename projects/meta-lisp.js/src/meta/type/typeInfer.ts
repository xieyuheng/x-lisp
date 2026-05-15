import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function typeInfer(mod: M.Mod, ctx: M.Ctx, exp: M.Exp): M.InferEffect {
  return (subst) => {
    switch (exp.kind) {
      case "Symbol": {
        const type = M.AtomType("symbol")
        return M.okInferEffect(type)(subst)
      }

      case "Keyword": {
        const type = M.AtomType("keyword")
        return M.okInferEffect(type)(subst)
      }

      case "String": {
        const type = M.AtomType("string")
        return M.okInferEffect(type)(subst)
      }

      case "Int": {
        const type = M.AtomType("int")
        return M.okInferEffect(type)(subst)
      }

      case "Float": {
        const type = M.AtomType("float")
        return M.okInferEffect(type)(subst)
      }

      case "Var": {
        const type = M.ctxLookupType(ctx, exp.name)
        if (type) return M.okInferEffect(type)(subst)
        return typeInferLookup(mod, ctx, exp.name, exp)(subst)
      }

      case "QualifiedVar": {
        const qualifiedMod = M.projectLookupMod(mod.project, exp.modName)
        if (qualifiedMod === undefined) {
          let message = `undefined module prefix`
          message += `\n  module: ${exp.modName}`
          message += `\n  name: ${exp.name}`
          if (exp.location)
            throw new S.ErrorWithSourceLocation(message, exp.location)
          else throw new Error(message)
        }
        return typeInferLookup(qualifiedMod, ctx, exp.name, exp)(subst)
      }

      case "Apply": {
        return M.inferThenInfer(typeInfer(mod, ctx, exp.target), (targetType) =>
          typeInferApplyArrowType(mod, ctx, targetType, exp.args, exp),
        )(subst)
      }

      case "Lambda": {
        if (exp.parameters.length === 0) {
          const retType = M.createFreshVarType("R")
          const type = M.ArrowType([], retType)
          return M.checkThenInfer(
            M.typeCheckByInfer(mod, ctx, exp.body, retType),
            M.okInferEffect(type),
          )(subst)
        } else if (exp.parameters.length === 1) {
          const argType = M.createFreshVarType("A")
          const retType = M.createFreshVarType("R")
          const type = M.ArrowType([argType], retType)
          const [parameter] = exp.parameters
          return M.checkThenInfer(
            M.typeCheckByInfer(
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
            M.typeCheckByInfer(
              mod,
              M.ctxPut(ctx, parameter, argType),
              M.Lambda(restParameters, exp.body, exp.location),
              retType,
            ),
            M.okInferEffect(type),
          )(subst)
        }
      }

      case "And":
      case "Or": {
        return M.checkThenInfer(
          M.sequenceCheckEffect(
            exp.exps.map((subExp) =>
              M.typeCheckByInfer(mod, ctx, subExp, M.AtomType("bool")),
            ),
          ),
          M.okInferEffect(M.AtomType("bool")),
        )(subst)
      }

      case "The": {
        const type = M.typeEvaluate(mod, M.emptyTypeEnv(), exp.type)
        return M.checkThenInfer(
          M.typeCheckAssignable(mod, ctx, exp.exp, type),
          M.okInferEffect(type),
        )(subst)
      }

      case "If": {
        const type = M.createFreshVarType("X")
        return M.checkThenInfer(
          M.sequenceCheckEffect([
            M.typeCheckByInfer(mod, ctx, exp.condition, M.AtomType("bool")),
            M.typeCheckByInfer(mod, ctx, exp.consequent, type),
            M.typeCheckByInfer(mod, ctx, exp.alternative, type),
          ]),
          M.okInferEffect(type),
        )(subst)
      }

      case "Let1": {
        return M.inferThenInfer(
          M.typeInfer(mod, ctx, exp.rhs),
          (inferredType) => (subst) => {
            ctx = M.substDeepWalkCtx(subst, ctx)
            inferredType = M.substDeepWalk(subst, inferredType)
            inferredType = M.typeGeneralizeInCtx(ctx, inferredType)
            ctx = M.ctxPut(ctx, exp.name, inferredType)
            return typeInfer(mod, ctx, exp.body)(subst)
          },
        )(subst)
      }

      case "Begin1": {
        return M.inferThenInfer(typeInfer(mod, ctx, exp.head), (_headType) =>
          typeInfer(mod, ctx, exp.body),
        )(subst)
      }

      case "LiteralList": {
        const elementType = M.createFreshVarType("E")
        const type = M.ListType(elementType)
        return M.checkThenInfer(
          M.sequenceCheckEffect([
            ...exp.elements.map((element) =>
              M.typeCheckByInfer(mod, ctx, element, elementType),
            ),
          ]),
          M.okInferEffect(type),
        )(subst)
      }

      case "LiteralSet": {
        const elementType = M.createFreshVarType("E")
        const type = M.SetType(elementType)
        return M.checkThenInfer(
          M.sequenceCheckEffect(
            exp.elements.map((element) =>
              M.typeCheckByInfer(mod, ctx, element, elementType),
            ),
          ),
          M.okInferEffect(type),
        )(subst)
      }

      case "LiteralHash": {
        const keyType = M.createFreshVarType("K")
        const valueType = M.createFreshVarType("V")
        const type = M.HashType(keyType, valueType)
        return M.checkThenInfer(
          M.sequenceCheckEffect(
            exp.entries.flatMap((entry) => [
              M.typeCheckByInfer(mod, ctx, entry.key, keyType),
              M.typeCheckByInfer(mod, ctx, entry.value, valueType),
            ]),
          ),
          M.okInferEffect(type),
        )(subst)
      }

      case "Arrow": {
        const type = M.TypeType()
        return M.checkThenInfer(
          M.sequenceCheckEffect([
            ...exp.argTypes.map((argType) =>
              M.typeCheckByInfer(mod, ctx, argType, type),
            ),
            M.typeCheckByInfer(mod, ctx, exp.retType, type),
          ]),
          M.okInferEffect(type),
        )(subst)
      }

      case "Polymorphic": {
        const type = M.TypeType()
        ctx = M.ctxPutMany(
          ctx,
          exp.parameters,
          exp.parameters.map(() => type),
        )
        return M.checkThenInfer(
          M.typeCheckByInfer(mod, ctx, exp.body, type),
          M.okInferEffect(type),
        )(subst)
      }

      default: {
        let message = `not inferable exp: ${exp.kind}`
        return M.errorInferEffect(exp, message)(subst)
      }
    }
  }
}

function typeInferLookup(
  mod: M.Mod,
  ctx: M.Ctx,
  name: string,
  exp: M.Exp,
): M.InferEffect {
  return (subst) => {
    if (ctx.transparentOpaqueNames.has(name)) {
      const opaqueTypeExp = mod.opaqueClaimed.get(name)
      if (opaqueTypeExp) {
        const transparentType = M.typeEvaluate(
          mod,
          M.emptyTypeEnv(),
          opaqueTypeExp,
          "transparent",
        )
        return M.okInferEffect(transparentType)(subst)
      }
    }

    const claimedType = M.modLookupClaimedType(mod, name)
    if (claimedType) return M.okInferEffect(claimedType)(subst)

    const definition = M.modLookupDefinition(mod, name)
    if (definition === undefined) {
      let message = `undefined variable`
      message += `\n  module: ${mod.name}`
      message += `\n  name: ${name}`
      return M.errorInferEffect(exp, message)(subst)
    }

    {
      // - for mutual recursive function
      const inferredType = M.modLookupInferredType(mod, name)
      if (inferredType) return M.okInferEffect(inferredType)(subst)
    }

    M.definitionCheck(definition)

    {
      const inferredType = M.modLookupInferredType(mod, name)
      if (inferredType) return M.okInferEffect(inferredType)(subst)
    }

    let message = `[typeInferLookup] internal error: infer fail after check`
    message += `\n  module name: ${mod.name}`
    message += `\n  name: ${name}`
    if (exp.location) throw new S.ErrorWithSourceLocation(message, exp.location)
    else throw new Error(message)
  }
}

function typeInferApplyArrowType(
  mod: M.Mod,
  ctx: M.Ctx,
  type: M.Type,
  args: Array<M.Exp>,
  originalExp: M.Exp,
): M.InferEffect {
  return (subst) => {
    if (args.length === 0) {
      const retType = M.createFreshVarType("R")
      const arrowType = M.ArrowType([], retType)
      const newSubst = M.typeUnify(subst, type, arrowType)
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
      const newSubst = M.typeUnify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = M.substDeepWalk(subst, type)
        let message = `expecting arrow type`
        message += `\n  expected type: ${M.formatType(type)}`
        message += `\n  args: ${M.formatExps(args)}`
        return M.errorInferEffect(originalExp, message)(subst)
      }

      const [arg] = args
      return M.checkThenInfer(
        M.typeCheckByInfer(mod, ctx, arg, argType),
        M.okInferEffect(retType),
      )(newSubst)
    } else {
      const argType = M.createFreshVarType("A")
      const retType = M.createFreshVarType("R")
      const arrowType = M.ArrowType([argType], retType)
      const newSubst = M.typeUnify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = M.substDeepWalk(subst, type)
        let message = `expecting arrow type`
        message += `\n  expected type: ${M.formatType(type)}`
        message += `\n  args: ${M.formatExps(args)}`
        return M.errorInferEffect(originalExp, message)(subst)
      }

      const [arg, ...restArgs] = args
      return M.checkThenInfer(
        M.typeCheckByInfer(mod, ctx, arg, argType),
        typeInferApplyArrowType(mod, ctx, retType, restArgs, originalExp),
      )(newSubst)
    }
  }
}
