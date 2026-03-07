import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as L from "../index.ts"

export function typeInfer(mod: L.Mod, ctx: L.Ctx, exp: L.Exp): L.InferEffect {
  return (subst) => {
    switch (exp.kind) {
      case "Symbol": {
        const type = L.createAtomType("symbol")
        return L.okInferEffect(type)(subst)
      }

      case "Keyword": {
        const type = L.createAtomType("keyword")
        return L.okInferEffect(type)(subst)
      }

      case "String": {
        const type = L.createAtomType("string")
        return L.okInferEffect(type)(subst)
      }

      case "Int": {
        const type = L.createAtomType("int")
        return L.okInferEffect(type)(subst)
      }

      case "Float": {
        const type = L.createAtomType("float")
        return L.okInferEffect(type)(subst)
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
          const retType = L.createFreshVarType("R")
          const type = L.createArrowType([], retType)
          return L.checkThenInfer(
            L.typeCheck(mod, ctx, exp.body, retType),
            L.okInferEffect(type),
          )(subst)
        } else if (exp.parameters.length === 1) {
          const argType = L.createFreshVarType("A")
          const retType = L.createFreshVarType("R")
          const type = L.createArrowType([argType], retType)
          const [parameter] = exp.parameters
          return L.checkThenInfer(
            L.typeCheck(
              mod,
              L.ctxPut(ctx, parameter, argType),
              exp.body,
              retType,
            ),
            L.okInferEffect(type),
          )(subst)
        } else {
          const argType = L.createFreshVarType("A")
          const retType = L.createFreshVarType("R")
          const type = L.createArrowType([argType], retType)
          const [parameter, ...restParameters] = exp.parameters
          return L.checkThenInfer(
            L.typeCheck(
              mod,
              L.ctxPut(ctx, parameter, argType),
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
          (inferredType) =>
            typeInfer(mod, L.ctxPut(ctx, exp.name, inferredType), exp.body),
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
        const elementType = L.createFreshVarType("E")
        const type = L.createListType(elementType)
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
        const elementType = L.createFreshVarType("E")
        const type = L.createSetType(elementType)
        return L.checkThenInfer(
          L.sequenceCheckEffect(
            exp.elements.map((element) =>
              L.typeCheck(mod, ctx, element, elementType),
            ),
          ),
          L.okInferEffect(type),
        )(subst)
      }

      case "Hash": {
        const keyType = L.createFreshVarType("K")
        const valueType = L.createFreshVarType("V")
        const type = L.createHashType(keyType, valueType)
        return L.checkThenInfer(
          L.sequenceCheckEffect(
            exp.entries.flatMap((entry) => [
              L.typeCheck(mod, ctx, entry.key, keyType),
              L.typeCheck(mod, ctx, entry.value, valueType),
            ]),
          ),
          L.okInferEffect(type),
        )(subst)
      }

      case "Tuple": {
        const elementTypes = exp.elements.map((_) => L.createFreshVarType("E"))
        const type = L.createTauType(elementTypes)
        return L.checkThenInfer(
          L.sequenceCheckEffect(
            exp.elements.map((element, index) =>
              L.typeCheck(mod, ctx, element, elementTypes[index]),
            ),
          ),
          L.okInferEffect(type),
        )(subst)
      }

      case "Object": {
        const attributeTypes = recordMapValue(exp.attributes, (_) =>
          L.createFreshVarType("A"),
        )
        const type = L.createClassType(attributeTypes)
        return L.checkThenInfer(
          L.sequenceCheckEffect(
            Object.keys(exp.attributes).map((key) =>
              L.typeCheck(mod, ctx, exp.attributes[key], attributeTypes[key]),
            ),
          ),
          L.okInferEffect(type),
        )(subst)
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
    if (args.length === 0) {
      const retType = L.createFreshVarType("R")
      const arrowType = L.createArrowType([], retType)
      const newSubst = L.typeUnify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = L.substApplyToType(subst, type)
        let message = `expecting nullary arrow type`
        message += `\n  given type: ${L.formatType(type)}`
        return L.errorInferEffect(originalExp, message)(subst)
      }

      return L.okInferEffect(retType)(newSubst)
    } else if (args.length === 1) {
      const argType = L.createFreshVarType("A")
      const retType = L.createFreshVarType("R")
      const arrowType = L.createArrowType([argType], retType)
      const newSubst = L.typeUnify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = L.substApplyToType(subst, type)
        let message = `expecting arrow type`
        message += `\n  given type: ${L.formatType(type)}`
        message += `\n  args: ${L.formatExps(args)}`
        return L.errorInferEffect(originalExp, message)(subst)
      }

      const [arg] = args
      return L.checkThenInfer(
        L.typeCheck(mod, ctx, arg, argType),
        L.okInferEffect(retType),
      )(newSubst)
    } else {
      const argType = L.createFreshVarType("A")
      const retType = L.createFreshVarType("R")
      const arrowType = L.createArrowType([argType], retType)
      const newSubst = L.typeUnify(subst, type, arrowType)
      if (newSubst === undefined) {
        type = L.substApplyToType(subst, type)
        let message = `expecting arrow type`
        message += `\n  given type: ${L.formatType(type)}`
        message += `\n  args: ${L.formatExps(args)}`
        return L.errorInferEffect(originalExp, message)(subst)
      }

      const [arg, ...restArgs] = args
      return L.checkThenInfer(
        L.typeCheck(mod, ctx, arg, argType),
        typeInferApplyArrowType(mod, ctx, retType, restArgs, originalExp),
      )(newSubst)
    }
  }
}
