import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as L from "../index.ts"

export function typeInfer(ctx: L.Ctx, exp: L.Exp): L.Value {
  switch (exp.kind) {
    case "Symbol": {
      return L.createAtomType("symbol")
    }

    case "Hashtag": {
      return L.createAtomType("hashtag")
    }

    case "String": {
      return L.createAtomType("string")
    }

    case "Int": {
      return L.createAtomType("int")
    }

    case "Float": {
      return L.createAtomType("float")
    }

    case "Var": {
      const type = L.ctxLookupType(ctx, exp.name)
      if (!type) {
        let message = `[typeInfer] found untyped variable`
        message += `\n  name: ${exp.name}`
        // console.log(S.reportWithMeta(message, exp.meta))
        if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
        else throw new Error(message)
      }

      return type
    }

    case "Apply": {
      const targetType = typeInfer(ctx, exp.target)
      return applyArrowType(ctx, targetType, exp.args)
    }

    case "And":
    case "Or": {
      for (const subExp of exp.exps) {
        L.typeCheck(ctx, subExp, L.createAtomType("bool"))
      }

      return L.createAtomType("bool")
    }

    default: {
      let message = `[typeInfer] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      throw new Error(message)
    }
  }
}

function applyArrowType(
  ctx: L.Ctx,
  arrowType: L.Value,
  args: Array<L.Exp>,
): L.Value {
  assert(L.isArrowType(arrowType))
  const argTypes = L.arrowTypeArgTypes(arrowType)

  if (argTypes.length === args.length) {
    for (const [i, _] of args.entries()) {
      L.typeCheck(ctx, args[i], argTypes[i])
    }

    return L.arrowTypeRetType(arrowType)
  } else if (argTypes.length > args.length) {
    for (const [i, _] of args.entries()) {
      L.typeCheck(ctx, args[i], argTypes[i])
    }

    return L.createArrowType(
      argTypes.slice(args.length),
      L.arrowTypeRetType(arrowType),
    )
  } else {
    for (const [i, _] of argTypes.entries()) {
      L.typeCheck(ctx, args[i], argTypes[i])
    }

    return applyArrowType(
      ctx,
      L.arrowTypeRetType(arrowType),
      args.slice(argTypes.length),
    )
  }
}
