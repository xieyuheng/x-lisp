import { range } from "@xieyuheng/helpers.js/range"
import assert from "node:assert"
import * as L from "../index.ts"

export function typeInfer(ctx: L.Ctx, exp: L.Exp): L.InferEffect {
  switch (exp.kind) {
    case "Symbol": {
      return L.okInferEffect(L.createAtomType("symbol"))
    }

    case "Hashtag": {
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
      if (!type) {
        let message = `found untyped variable`
        message += `\n  name: ${exp.name}`
        return L.errorInferEffect(exp, message)
      }

      return L.okInferEffect(type)
    }

    case "Apply": {
      return L.inferThenInfer(typeInfer(ctx, exp.target), (targetType) =>
        applyArrowType(ctx, targetType, exp.args),
      )
    }

    case "And":
    case "Or": {
      return L.checkThenInfer(
        L.sequenceCheckEffect(
          exp.exps.map((subExp) =>
            L.typeCheck(ctx, subExp, L.createAtomType("bool")),
          ),
        ),
        L.okInferEffect(L.createAtomType("bool")),
      )
    }

    default: {
      let message = `[typeInfer] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      return L.errorInferEffect(exp, message)
    }
  }
}

function applyArrowType(
  ctx: L.Ctx,
  arrowType: L.Value,
  args: Array<L.Exp>,
): L.InferEffect {
  assert(L.isArrowType(arrowType))
  const argTypes = L.arrowTypeArgTypes(arrowType)

  if (argTypes.length === args.length) {
    const length = args.length
    return L.checkThenInfer(
      L.sequenceCheckEffect(
        range(length).map((i) => L.typeCheck(ctx, args[i], argTypes[i])),
      ),
      L.okInferEffect(L.arrowTypeRetType(arrowType)),
    )
  } else if (argTypes.length > args.length) {
    const length = args.length
    return L.checkThenInfer(
      L.sequenceCheckEffect(
        range(length).map((i) => L.typeCheck(ctx, args[i], argTypes[i])),
      ),
      L.okInferEffect(
        L.createArrowType(
          argTypes.slice(args.length),
          L.arrowTypeRetType(arrowType),
        ),
      ),
    )
  } else {
    const length = argTypes.length
    return L.checkThenInfer(
      L.sequenceCheckEffect(
        range(length).map((i) => L.typeCheck(ctx, args[i], argTypes[i])),
      ),
      applyArrowType(
        ctx,
        L.arrowTypeRetType(arrowType),
        args.slice(argTypes.length),
      ),
    )
  }
}
