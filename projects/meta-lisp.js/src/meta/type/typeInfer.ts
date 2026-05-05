import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function typeInfer(mod: M.Mod, ctx: M.Ctx, exp: M.Exp): M.InferEffect {
  return (subst) => {
    switch (exp.kind) {
      case "Symbol": {
        const type = M.createAtomType("symbol")
        return M.okInferEffect(type)(subst)
      }

      case "Keyword": {
        const type = M.createAtomType("keyword")
        return M.okInferEffect(type)(subst)
      }

      case "String": {
        const type = M.createAtomType("string")
        return M.okInferEffect(type)(subst)
      }

      case "Int": {
        const type = M.createAtomType("int")
        return M.okInferEffect(type)(subst)
      }

      case "Float": {
        const type = M.createAtomType("float")
        return M.okInferEffect(type)(subst)
      }

      case "Var": {
        const type = M.ctxLookupType(ctx, exp.name)
        if (type) return M.okInferEffect(type)(subst)
        return typeInferVarInMod(mod, exp.name, exp)(subst)
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
        return typeInferVarInMod(qualifiedMod, exp.name, exp)(subst)
      }

      case "Apply": {
        if (exp.target.kind === "Keyword") {
          const targetType = M.createPolymorphicType(
            [M.createVarType("R", 0n), M.createVarType("A", 0n)],
            M.createArrowType(
              [
                M.createExtendInterfaceType(M.createVarType("R", 0n), {
                  [exp.target.content]: M.createVarType("A", 0n),
                }),
              ],
              M.createVarType("A", 0n),
            ),
          )
          return typeInferApplyArrowType(
            mod,
            ctx,
            targetType,
            exp.args,
            exp,
          )(subst)
        } else {
          return M.inferThenInfer(
            typeInfer(mod, ctx, exp.target),
            (targetType) =>
              typeInferApplyArrowType(mod, ctx, targetType, exp.args, exp),
          )(subst)
        }
      }

      case "Lambda": {
        if (exp.parameters.length === 0) {
          const retType = M.createFreshVarType("R")
          const type = M.createArrowType([], retType)
          return M.checkThenInfer(
            M.typeCheckByInfer(mod, ctx, exp.body, retType),
            M.okInferEffect(type),
          )(subst)
        } else if (exp.parameters.length === 1) {
          const argType = M.createFreshVarType("A")
          const retType = M.createFreshVarType("R")
          const type = M.createArrowType([argType], retType)
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
          const type = M.createArrowType([argType], retType)
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
              M.typeCheckByInfer(mod, ctx, subExp, M.createAtomType("bool")),
            ),
          ),
          M.okInferEffect(M.createAtomType("bool")),
        )(subst)
      }

      case "The": {
        const type = M.evaluate(mod, M.emptyEnv(), exp.type)
        return M.checkThenInfer(
          M.typeCheckAssignable(mod, ctx, exp.exp, type),
          M.okInferEffect(type),
        )(subst)
      }

      case "If": {
        const type = M.createFreshVarType("X")
        return M.checkThenInfer(
          M.sequenceCheckEffect([
            M.typeCheckByInfer(
              mod,
              ctx,
              exp.condition,
              M.createAtomType("bool"),
            ),
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
            ctx = M.substApplyToCtx(subst, ctx)
            inferredType = M.substApplyToType(subst, inferredType)
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
        const type = M.createListType(elementType)
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
        const type = M.createSetType(elementType)
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
        const type = M.createHashType(keyType, valueType)
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

      case "LiteralRecord": {
        const attributeTypes = recordMapValue(exp.attributes, (_) =>
          M.createFreshVarType("A"),
        )
        const type = M.createInterfaceType(attributeTypes)
        return M.checkThenInfer(
          M.sequenceCheckEffect(
            Object.keys(exp.attributes).map((key) =>
              M.typeCheckByInfer(
                mod,
                ctx,
                exp.attributes[key],
                attributeTypes[key],
              ),
            ),
          ),
          M.okInferEffect(type),
        )(subst)
      }

      case "Interface": {
        const type = M.createTypeType()
        return M.checkThenInfer(
          M.sequenceCheckEffect(
            Object.keys(exp.attributeTypes).map((key) =>
              M.typeCheckByInfer(mod, ctx, exp.attributeTypes[key], type),
            ),
          ),
          M.okInferEffect(type),
        )(subst)
      }

      case "ExtendInterface": {
        const type = M.createTypeType()
        return M.checkThenInfer(
          M.sequenceCheckEffect([
            M.typeCheckByInfer(mod, ctx, exp.baseType, type),
            ...Object.keys(exp.attributeTypes).map((key) =>
              M.typeCheckByInfer(mod, ctx, exp.attributeTypes[key], type),
            ),
          ]),
          M.okInferEffect(type),
        )(subst)
      }

      case "Extend": {
        const baseType = M.createExtendInterfaceType(
          M.createFreshVarType("R"),
          {},
        )
        const type = M.createExtendInterfaceType(
          baseType,
          recordMapValue(exp.attributes, (_) => M.createFreshVarType("A")),
        )
        return M.checkThenInfer(
          M.typeCheckByInfer(mod, ctx, exp.base, baseType),
          M.okInferEffect(type),
        )(subst)
      }

      case "Update":
      case "UpdateMut": {
        const baseType = M.createExtendInterfaceType(
          M.createFreshVarType("R"),
          recordMapValue(exp.attributes, (_) => M.createFreshVarType("A")),
        )
        return M.checkThenInfer(
          M.typeCheckByInfer(mod, ctx, exp.base, baseType),
          M.typeInfer(mod, ctx, exp.base),
        )(subst)
      }

      case "Arrow": {
        const type = M.createTypeType()
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
        const type = M.createTypeType()
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

function typeInferVarInMod(
  mod: M.Mod,
  name: string,
  exp: M.Exp,
): M.InferEffect {
  return (subst) => {
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

    let message = `[typeInferVarInMod] internal error: infer fail after check`
    message += `\n  module name: ${mod.name}`
    message += `\n  name: ${name}`
    if (exp.location) throw new S.ErrorWithSourceLocation(message, exp.location)
    else throw new Error(message)
  }
}

function typeInferApplyArrowType(
  mod: M.Mod,
  ctx: M.Ctx,
  type: M.Value,
  args: Array<M.Exp>,
  originalExp: M.Exp,
): M.InferEffect {
  return (subst) => {
    if (args.length === 0) {
      const retType = M.createFreshVarType("R")
      const arrowType = M.createArrowType([], retType)
      const newSubst = M.typeUnify([], subst, type, arrowType)
      if (newSubst === undefined) {
        type = M.substApplyToType(subst, type)
        let message = `expecting nullary arrow type`
        message += `\n  given type: ${M.formatTypeInMod(mod, type)}`
        return M.errorInferEffect(originalExp, message)(subst)
      }

      return M.okInferEffect(retType)(newSubst)
    } else if (args.length === 1) {
      const argType = M.createFreshVarType("A")
      const retType = M.createFreshVarType("R")
      const arrowType = M.createArrowType([argType], retType)
      const newSubst = M.typeUnify([], subst, type, arrowType)
      if (newSubst === undefined) {
        type = M.substApplyToType(subst, type)
        let message = `expecting arrow type`
        message += `\n  given type: ${M.formatTypeInMod(mod, type)}`
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
      const arrowType = M.createArrowType([argType], retType)
      const newSubst = M.typeUnify([], subst, type, arrowType)
      if (newSubst === undefined) {
        type = M.substApplyToType(subst, type)
        let message = `expecting arrow type`
        message += `\n  given type: ${M.formatTypeInMod(mod, type)}`
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
