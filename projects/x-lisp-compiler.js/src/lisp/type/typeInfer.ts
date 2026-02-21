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
      assert(type)
      return type
    }

      // case "Apply": {}

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
