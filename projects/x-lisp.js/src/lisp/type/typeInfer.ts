import { range } from "@xieyuheng/helpers.js/range"
import * as L from "../index.ts"

export function expPreferInfer(exp: L.Exp): boolean {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "Var":
    case "Apply":
    case "And":
    case "Or":
    case "The": {
      return true
    }

    default: {
      return false
    }
  }
}

export function typeInfer(mod: L.Mod, ctx: L.Ctx, exp: L.Exp): L.InferEffect {
  switch (exp.kind) {
    case "Symbol": {
      return L.okInferEffect(L.createAtomType("symbol"))
    }

    case "Hashtag": {
      if (exp.content === "void") {
        return L.okInferEffect(L.createAtomType("void"))
      }

      if (exp.content === "null") {
        return L.okInferEffect(L.createAtomType("null"))
      }

      if (exp.content === "t" || exp.content === "f") {
        return L.okInferEffect(L.createAtomType("bool"))
      }

      return L.okInferEffect(L.createAtomType("hashtag"))
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
        applyArrowType(mod, ctx, targetType, exp.args, exp),
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
      return L.checkThenInfer(
        L.typeCheck(mod, ctx, exp.head, L.createAnyType()),
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

function applyArrowType(
  mod: L.Mod,
  ctx: L.Ctx,
  arrowType: L.Value,
  args: Array<L.Exp>,
  originalExp: L.Exp,
): L.InferEffect {
  if (L.isPolymorphicType(arrowType)) {
    arrowType = L.polymorphicTypeUnfold(arrowType)
  }

  if (!L.isArrowType(arrowType)) {
    let message = `expecting arrow type to be applyed`
    message += `\n  given type: ${L.formatType(arrowType)}`
    message += `\n  args: ${L.formatExps(args)}`
    return L.errorInferEffect(originalExp, message)
  }

  const argTypes = L.arrowTypeArgTypes(arrowType)
  const retType = L.arrowTypeRetType(arrowType)

  if (argTypes.length === args.length) {
    const length = args.length
    return L.checkThenInfer(
      L.sequenceCheckEffect(
        range(length).map((i) => L.typeCheck(mod, ctx, args[i], argTypes[i])),
      ),
      L.okInferEffect(retType),
    )
  } else if (argTypes.length > args.length) {
    const length = args.length
    return L.checkThenInfer(
      L.sequenceCheckEffect(
        range(length).map((i) => L.typeCheck(mod, ctx, args[i], argTypes[i])),
      ),
      L.okInferEffect(L.createArrowType(argTypes.slice(args.length), retType)),
    )
  } else {
    const length = argTypes.length
    return L.checkThenInfer(
      L.sequenceCheckEffect(
        range(length).map((i) => L.typeCheck(mod, ctx, args[i], argTypes[i])),
      ),
      applyArrowType(
        mod,
        ctx,
        retType,
        args.slice(argTypes.length),
        originalExp,
      ),
    )
  }
}
