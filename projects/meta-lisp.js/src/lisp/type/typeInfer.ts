import assert from "node:assert"
import * as L from "../index.ts"

export function typeInfer(mod: L.Mod, ctx: L.Ctx, exp: L.Exp): L.InferEffect {
  return (subst) => {
    switch (exp.kind) {
      case "Symbol": {
        return L.okInferEffect(L.createAtomType("symbol"))(subst)
      }

      case "Keyword": {
        return L.okInferEffect(L.createAtomType("keyword"))(subst)
      }

      case "String": {
        return L.okInferEffect(L.createAtomType("string"))(subst)
      }

      case "Int": {
        return L.okInferEffect(L.createAtomType("int"))(subst)
      }

      case "Float": {
        return L.okInferEffect(L.createAtomType("float"))(subst)
      }

      case "Var": {
        const type = L.ctxLookupType(ctx, exp.name)
        if (type) return L.okInferEffect(type)(subst)

        const topLevelType = L.modLookupType(mod, exp.name)
        if (topLevelType) return L.okInferEffect(topLevelType)(subst)

        let message = `untyped variable`
        message += `\n  name: ${exp.name}`
        return L.errorInferEffect(exp, message)(subst)
      }

      case "Apply": {
        return L.inferThenInfer(typeInfer(mod, ctx, exp.target), (targetType) =>
          typeInferApplyArrowType(mod, ctx, targetType, exp.args, exp),
        )(subst)
      }

      case "Lambda": {
        if (exp.parameters.length === 0) {
          const type = L.createArrowType([], L.createFreshVarType("R"))
          const argTypes = L.arrowTypeArgTypes(type)
          const retType = L.arrowTypeRetType(type)
          return L.checkThenInfer(
            L.typeCheck(mod, ctx, exp.body, retType),
            L.okInferEffect(type),
          )(subst)
        } else if (exp.parameters.length === 1) {
          const type = L.createArrowType(
            [L.createFreshVarType("A")],
            L.createFreshVarType("R"),
          )

          const [argType] = L.arrowTypeArgTypes(type)
          const retType = L.arrowTypeRetType(type)

          const [parameter] = exp.parameters
          ctx = L.ctxPut(ctx, parameter, argType)
          return L.checkThenInfer(
            L.typeCheck(mod, ctx, exp.body, retType),
            L.okInferEffect(type),
          )(subst)
        } else {
          const type = L.createArrowType(
            [L.createFreshVarType("A")],
            L.createFreshVarType("R"),
          )
          const [argType] = L.arrowTypeArgTypes(type)
          const retType = L.arrowTypeRetType(type)
          const [parameter, ...restParameters] = exp.parameters
          ctx = L.ctxPut(ctx, parameter, argType)
          return L.checkThenInfer(
            L.typeCheck(
              mod,
              ctx,
              L.Lambda(restParameters, exp.body, exp.meta),
              retType,
            ),
            L.okInferEffect(type),
          )(subst)
        }
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
        )(subst)
      }

      case "The": {
        const type = L.evaluate(mod, L.emptyEnv(), exp.type)
        return L.checkThenInfer(
          L.typeCheck(mod, ctx, exp.exp, type),
          L.okInferEffect(type),
        )(subst)
      }

      case "If": {
        const type = L.createFreshVarType("X")
        return L.checkThenInfer(
          L.sequenceCheckEffect([
            L.typeCheck(mod, ctx, exp.condition, L.createAtomType("bool")),
            L.typeCheck(mod, ctx, exp.consequent, type),
            L.typeCheck(mod, ctx, exp.alternative, type),
          ]),
          L.okInferEffect(type),
        )(subst)
      }

      case "When": {
        return typeInfer(mod, ctx, L.desugarWhen(exp))(subst)
      }

      case "Unless": {
        return typeInfer(mod, ctx, L.desugarUnless(exp))(subst)
      }

      case "Cond": {
        return typeInfer(mod, ctx, L.desugarCond(exp.condLines))(subst)
      }

      case "Let1": {
        return L.inferThenInfer(
          L.typeInfer(mod, ctx, exp.rhs),
          (inferredType) => {
            ctx = L.ctxPut(ctx, exp.name, inferredType)
            return typeInfer(mod, ctx, exp.body)
          },
        )(subst)
      }

      case "Begin1": {
        return L.inferThenInfer(typeInfer(mod, ctx, exp.head), (_headType) =>
          typeInfer(mod, ctx, exp.body),
        )(subst)
      }

      case "BeginSugar": {
        return typeInfer(mod, ctx, L.desugarBegin(exp.sequence))(subst)
      }

      case "List": {
        const type = L.createListType(L.createFreshVarType("E"))
        const elementType = L.listTypeElementType(type)
        return L.checkThenInfer(
          L.sequenceCheckEffect([
            ...exp.elements.map((element) =>
              L.typeCheck(mod, ctx, element, elementType),
            ),
          ]),
          L.okInferEffect(type),
        )(subst)
      }

      case "Set": {
        const type = L.createSetType(L.createFreshVarType("E"))
        return L.checkThenInfer(
          L.sequenceCheckEffect(
            exp.elements.map((element) =>
              L.typeCheck(mod, ctx, element, L.setTypeElementType(type)),
            ),
          ),
          L.okInferEffect(type),
        )(subst)
      }

      case "Hash": {
        const type = L.createHashType(
          L.createFreshVarType("K"),
          L.createFreshVarType("V"),
        )
        return L.checkThenInfer(
          L.sequenceCheckEffect(
            exp.entries.flatMap((entry) => [
              L.typeCheck(mod, ctx, entry.key, L.hashTypeKeyType(type)),
              L.typeCheck(mod, ctx, entry.value, L.hashTypeValueType(type)),
            ]),
          ),
          L.okInferEffect(type),
        )(subst)
      }

      case "Tuple": {
        let message = `TODO`
        return L.errorInferEffect(exp, message)(subst)
      }

      case "Object": {
        let message = `TODO`
        return L.errorInferEffect(exp, message)(subst)
      }

      case "Quote": {
        return typeInfer(mod, ctx, L.desugarQuote(exp.sexp))(subst)
      }

      default: {
        let message = `not inferable exp: ${exp.kind}`
        return L.errorInferEffect(exp, message)(subst)
      }
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
