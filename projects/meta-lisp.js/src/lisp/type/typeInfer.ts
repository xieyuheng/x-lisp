import assert from "node:assert"
import * as L from "../index.ts"

export function typeInfer(mod: L.Mod, ctx: L.Ctx, exp: L.Exp): L.InferEffect {
  switch (exp.kind) {
    case "Symbol": {
      return L.okInferEffect(L.createAtomType("symbol"))
    }

    case "Keyword": {
      return L.okInferEffect(L.createAtomType("keyword"))
    }

    case "String": {
      return L.okInferEffect(L.createAtomType("string"))
    }

    case "Int": {
      return L.okInferEffect(L.createAtomType("int"))
    }

    case "Float": {
      return L.okInferEffect(L.createAtomType("float"))
    }

    case "Var": {
      const type = L.ctxLookupType(ctx, exp.name)
      if (type) return L.okInferEffect(type)

      const topLevelType = L.modLookupType(mod, exp.name)
      if (topLevelType) return L.okInferEffect(topLevelType)

      let message = `untyped variable`
      message += `\n  name: ${exp.name}`
      return L.errorInferEffect(exp, message)
    }

    case "Apply": {
      return L.inferThenInfer(typeInfer(mod, ctx, exp.target), (targetType) =>
        typeInferApplyArrowType(mod, ctx, targetType, exp.args, exp),
      )
    }

    case "And":
    case "Or": {
      return L.checkThenInfer(
        L.sequenceCheckEffect(
          exp.exps.map((subExp) =>
            L.typeCheck(mod, ctx, subExp, L.createAtomType("bool")),
          ),
        ),
        L.okInferEffect(L.createAtomType("bool")),
      )
    }

    case "The": {
      const type = L.evaluate(mod, L.emptyEnv(), exp.type)
      return L.checkThenInfer(
        L.typeCheck(mod, ctx, exp.exp, type),
        L.okInferEffect(type),
      )
    }

    case "Let1": {
      return L.inferThenInfer(
        L.typeInfer(mod, ctx, exp.rhs),
        (inferredType) => {
          ctx = L.ctxPut(ctx, exp.name, inferredType)
          return typeInfer(mod, ctx, exp.body)
        },
      )
    }

    case "Begin1": {
      return L.inferThenInfer(typeInfer(mod, ctx, exp.head), (_headType) =>
        typeInfer(mod, ctx, exp.body),
      )
    }

    case "BeginSugar": {
      return typeInfer(mod, ctx, L.desugarBegin(exp.sequence))
    }

    default: {
      let message = `not inferable exp: ${exp.kind}`
      return L.errorInferEffect(exp, message)
    }
  }
}

function typeInferApplyArrowType(
  mod: L.Mod,
  ctx: L.Ctx,
  type: L.Value,
  args: Array<L.Exp>,
  originalExp: L.Exp,
): L.InferEffect {
  return (subst) => {
    type = L.substApplyToType(subst, type)

    if (L.isPolymorphicType(type)) {
      type = L.polymorphicTypeUnfold(type)
    }

    if (args.length === 0) {
      const arrowType = L.createArrowType([], L.createFreshVarType("R"))
      const newSubst = L.typeUnify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = L.substApplyToType(subst, type)
        let message = `expecting nullary arrow type`
        message += `\n  given type: ${L.formatType(type)}`
        return L.errorInferEffect(originalExp, message)(subst)
      }

      subst = newSubst
      type = L.substApplyToType(subst, arrowType)

      type = L.arrowTypeNormalize(type)
      const argTypes = L.arrowTypeArgTypes(type)
      assert(argTypes.length === 0)
      const retType = L.arrowTypeRetType(type)
      return L.okInferEffect(retType)(subst)
    } else if (args.length === 1) {
      const arrowType = L.createArrowType(
        [L.createFreshVarType("A")],
        L.createFreshVarType("R"),
      )
      const newSubst = L.typeUnify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = L.substApplyToType(subst, type)
        let message = `expecting arrow type`
        message += `\n  given type: ${L.formatType(type)}`
        message += `\n  args: ${L.formatExps(args)}`
        return L.errorInferEffect(originalExp, message)(subst)
      }

      subst = newSubst
      type = L.substApplyToType(subst, arrowType)

      type = L.arrowTypeNormalize(type)
      const [argType] = L.arrowTypeArgTypes(type)
      const retType = L.arrowTypeRetType(type)

      const [arg] = args
      return L.checkThenInfer(
        L.typeCheck(mod, ctx, arg, argType),
        L.okInferEffect(retType),
      )(subst)
    } else {
      const arrowType = L.createArrowType(
        [L.createFreshVarType("A")],
        L.createFreshVarType("R"),
      )
      const newSubst = L.typeUnify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = L.substApplyToType(subst, type)
        let message = `expecting arrow type`
        message += `\n  given type: ${L.formatType(type)}`
        message += `\n  args: ${L.formatExps(args)}`
        return L.errorInferEffect(originalExp, message)(subst)
      }

      subst = newSubst
      type = L.substApplyToType(subst, arrowType)

      type = L.arrowTypeNormalize(type)
      const [argType] = L.arrowTypeArgTypes(type)
      const retType = L.arrowTypeRetType(type)

      const [arg, ...restArgs] = args
      return L.checkThenInfer(
        L.typeCheck(mod, ctx, arg, argType),
        typeInferApplyArrowType(mod, ctx, retType, restArgs, originalExp),
      )(subst)
    }
  }
}
